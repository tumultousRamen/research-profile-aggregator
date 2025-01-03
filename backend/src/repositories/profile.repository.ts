import { PrismaClient, Prisma } from '@prisma/client'
import { Profile, Publication, CreateProfileInput, UpdateProfileInput, CreatePublicationInput, UpdatePublicationInput } from '../types/models'

export class ProfileRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async create(data: CreateProfileInput): Promise<Profile> {
    return this.prisma.profile.create({ data, include: {publications: true} })
  }

  async findById(id: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { id }, include: {publications: true} })
  }

  async findByEmail(email: string): Promise<Profile | null>{
    return this.prisma.profile.findUnique({ where: { email }, include: {publications: true} })
  }

  async update(id: string, data: Partial<CreateProfileInput>): Promise<Profile> {
    return this.prisma.profile.update({where: {id}, data, include: {publications: true}})
  }

  async addPublication(profileId: string, pubData: Omit<CreatePublicationInput, 'profileId'>): Promise<Publication> {
    return this.prisma.publication.create({
      data: {
        ...pubData,
        profile: {
          connect: { id: profileId }
        }
      }
    })
  }

    async getPublications(profileId: string): Promise<Publication[]> {
        return this.prisma.publication.findMany({ where: { profileId } })
    }
}