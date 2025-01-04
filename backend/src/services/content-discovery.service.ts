// src/services/content-discovery.service.ts

import axios from 'axios';
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
    // XML parsing implementation will go here
    // Will be implemented once we have example XML response
    return [];
  }
}