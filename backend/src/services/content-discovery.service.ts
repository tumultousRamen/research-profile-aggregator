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
    this.xmlParser = new XMLParser(
      {
        attributeNamePrefix: '_',
        textNodeName: 'text',
        ignoreAttributes: false
      }
    );
  }

  async fetchArxivPapers(profile: Profile): Promise<ArxivPaper[]> {
    try {
      const searchQuery = this.buildArxivQuery(profile);
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

      return this.parseArxivResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Arxiv API error:', error.response?.status, error.response?.statusText);
        throw new Error(`Arxiv API error: ${error.response?.status}`);
      }
      throw error;
    }
  }

  public buildArxivQuery(profile: Profile): string {
    const queries: string[] = [];
    
    queries.push(`au:"${profile.name}"`);
    
    if (profile.institution) {
      queries.push(`(aff:${profile.institution})`);
    }

    if (profile.researchAreas.length > 0) {
      const subjectQuery = profile.researchAreas
        .map(area => `cat:${area.toLowerCase()}`)
        .join(' OR ');
      queries.push(`(${subjectQuery})`);
    }

    return queries.join(' AND ');
  }

  private parseArxivResponse(xmlData: string): ArxivPaper[] {
    const parsed = this.xmlParser.parse(xmlData);
    const entries = parsed.feed.entry;

    if (!Array.isArray(entries)) {
      return [];
    }

    return entries.map((entry: any) => {
      // Handle multiple authors
      const authors = Array.isArray(entry.author) 
        ? entry.author.map((a: any) => a.name.text)
        : [entry.author.name.text];

      // Extract arXiv ID from the entry ID URL
      const arxivId = entry.id.text.split('/abs/')[1];

      // Find PDF link
      const links = Array.isArray(entry.link) ? entry.link : [entry.link];
      const pdfLink = links.find((link: any) => link._title === 'pdf')._href;
      const doiLink = links.find((link: any) => link._title === 'doi')?._href;

      // Extract categories
      const categories = Array.isArray(entry.category) 
        ? entry.category.map((c: any) => c._term)
        : [entry.category._term];

      return {
        title: entry.title.text,
        authors,
        summary: entry.summary.text.trim(),
        publishedDate: new Date(entry.published.text),
        lastUpdatedDate: new Date(entry.updated.text),
        doi: entry['arxiv:doi']?.text,
        arxivId,
        primaryCategory: entry['arxiv:primary_category']._term,
        categories,
        links: {
          abstract: entry.id.text,
          pdf: pdfLink,
          doi: doiLink
        }
      };
    });
  }
}