// src/services/content-discovery.service.ts

import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { Profile } from '../types/models';

interface ArxivPaper {
  title: string;
  authors: string[];
  summary: string;
  publishedDate: Date;
  lastUpdatedDate: Date;
  doi?: string;
  arxivId: string;
  primaryCategory: string;
  categories: string[];
  links: {
    abstract: string;
    pdf: string;
    doi?: string;
  };
}

export class ContentDiscoveryService {
  private readonly ARXIV_API_BASE = 'http://export.arxiv.org/api/query';
  private readonly xmlParser: XMLParser;

  constructor() {
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true,
      trimValues: true,
      removeNSPrefix: true
    });
  }

  async fetchArxivPapers(profile: Profile): Promise<ArxivPaper[]> {
    try {
      const searchQuery = this.buildArxivQuery(profile);
      console.log('Search Query:', searchQuery);

      const response = await axios.get(this.ARXIV_API_BASE, {
        params: {
          search_query: searchQuery,
          start: 0,
          max_results: 100,
          sortBy: 'submittedDate',
          sortOrder: 'descending'
        },
        headers: {
          'Accept': 'application/xml'
        }
      });

      // Log the raw response for debugging
      console.log('Raw XML Response (first 500 chars):', response.data.substring(0, 500));

      const papers = this.parseArxivResponse(response.data);
      console.log(`Successfully parsed ${papers.length} papers`);
      return papers;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Arxiv API error:', error.response?.status, error.response?.statusText);
        throw new Error(`Arxiv API error: ${error.response?.status}`);
      }
      console.error('Error fetching papers:', error);
      throw error;
    }
  }

  private buildArxivQuery(profile: Profile): string {
    const queries: string[] = [];
    
    // Add author name query
    queries.push(`au:"${profile.name}"`);
    
    // Add institution if available
    if (profile.institution) {
      queries.push(`(aff:${profile.institution})`);
    }

    // Add research areas as subject areas if applicable
    if (profile.researchAreas.length > 0) {
      const subjectQuery = profile.researchAreas
        .map(area => `cat:${area.toLowerCase()}`)
        .join(' OR ');
      queries.push(`(${subjectQuery})`);
    }

    return queries.join(' AND ');
  }

  private getArxivIdFromUrl(url: string): string {
    try {
      // Try to extract ID from URL
      if (url.includes('/abs/')) {
        const parts = url.split('/abs/');
        if (parts[1]) {
          // Remove version number if present
          return parts[1].split('v')[0];
        }
      }
      // Fallback to last part of URL
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        return lastPart.split('v')[0];
      }
      return 'unknown';
    } catch (error) {
      console.error('Error extracting arXiv ID from URL:', url);
      return 'unknown';
    }
  }

  private parseArxivResponse(xmlData: string): ArxivPaper[] {
    try {
      const parsed = this.xmlParser.parse(xmlData);
      console.log('Parsed XML structure (first 500 chars):', JSON.stringify(parsed, null, 2).substring(0, 500));

      const entries = parsed.feed?.entry || [];
      const entriesArray = Array.isArray(entries) ? entries : [entries];

      return entriesArray
        .map((entry: any): ArxivPaper | null => {
          try {
            // Debug log the entry
            console.log('Processing entry:', JSON.stringify(entry, null, 2).substring(0, 200));

            // Handle authors
            const authors = Array.isArray(entry.author) 
              ? entry.author.map((a: any) => a?.name?.['#text'] || 'Unknown Author')
              : [entry.author?.name?.['#text'] || 'Unknown Author'];

            // Handle ID and arxivId
            const idUrl = entry.id?.['#text'] || '';
            const arxivId = this.getArxivIdFromUrl(idUrl);

            // Handle links
            const links = Array.isArray(entry.link) ? entry.link : [entry.link].filter(Boolean);
            const pdfLink = links.find((link: any) => link?.['@_title'] === 'pdf')?.['@_href'] || '';
            const doiLink = links.find((link: any) => link?.['@_title'] === 'doi')?.['@_href'];

            // Handle categories
            const categories = Array.isArray(entry.category)
              ? entry.category.map((c: any) => c?.['@_term'] || 'unknown')
              : [entry.category?.['@_term'] || 'unknown'];

            // Create paper object
            const paper: ArxivPaper = {
              title: entry.title?.['#text'] || 'Untitled',
              authors,
              summary: entry.summary?.['#text']?.trim() || 'No summary available',
              publishedDate: new Date(entry.published?.['#text'] || Date.now()),
              lastUpdatedDate: new Date(entry.updated?.['#text'] || Date.now()),
              doi: entry['arxiv:doi']?.['#text'],
              arxivId,
              primaryCategory: entry['arxiv:primary_category']?.['@_term'] || categories[0] || 'unknown',
              categories,
              links: {
                abstract: idUrl,
                pdf: pdfLink,
                doi: doiLink
              }
            };

            return paper;
          } catch (error) {
            console.error('Error parsing entry:', error);
            console.error('Problematic entry:', JSON.stringify(entry, null, 2));
            return null;
          }
        })
        .filter((paper): paper is ArxivPaper => paper !== null);
    } catch (error) {
      console.error('Error parsing XML:', error);
      console.error('Raw XML (first 500 chars):', xmlData.substring(0, 500));
      return [];
    }
  }
}