import axios from 'axios';
import { ProfileRepository } from '../repositories/profile.repository';
import { ContentDiscoveryService } from '../services/content-discovery.service';
import { PrismaClient } from '@prisma/client';
import { Profile } from '../types/models';

async function testArxivApi() {
    const repository = new ProfileRepository();
    const contentService = new ContentDiscoveryService();
    const ARXIV_API_BASE = 'http://export.arxiv.org/api/query';
    const prisma = new PrismaClient();

    try {
        await prisma.$connect();
        console.log('Connected to database successfully!');

        const newProfile: Profile = {
            id: "test-id",
            createdAt: new Date(),
            updatedAt: new Date(),
            name: "Geoffrey Hinton",
            institution: "University of Toronto",
            department: "Computer Science",
            title: "Professor Emeritus",
            email: "geoffrey.hinton@utoronto.ca",
            researchAreas: ["Machine Learning", "Neural Networks", "Artificial Intelligence"],
            scholarProfileUrl: "https://scholar.google.com/citations?user=JicYPdAAAAAJ",
            publications: []
        };

        console.log('New profile created:', newProfile);

        console.log('Fetching papers from Arxiv...');
        const searchQuery = contentService.buildArxivQuery(newProfile);
        const response = await axios.get(ARXIV_API_BASE, {
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

        console.log('Arxiv API response data:', response.data);
    } catch (error) {
        console.error('Failed to create profile and fetch papers:', error);
    }
}

testArxivApi().catch(console.error);