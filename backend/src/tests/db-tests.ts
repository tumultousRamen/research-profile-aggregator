import { ProfileRepository } from "../repositories/profile.repository";
import { PrismaClient } from '@prisma/client';

async function testDatabaseConnection() {
    const repository = new ProfileRepository();
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        console.log('Connected to database successfully!');
        const newProfile = await repository.create(
            {
                name: 'John Doe',
                email: 'test@researcher.com',
                institution: 'University of Testing',
                researchAreas: ['Testing', 'Quality Assurance']
            }
        );

        console.log('New profile created:', newProfile);

        const retrievedProfile = await repository.findById(newProfile.id);
        console.log('Retrieved profile:', retrievedProfile);

        const publication = await repository.addPublication(newProfile.id, {
            title: "Test Publication",
            abstract: "This is a test publication",
            publishedDate: new Date()
        });

        console.log('New publication created:', publication);
    } catch (error) {
        console.error('Failed to test database connection:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testDatabaseConnection().catch(console.error);