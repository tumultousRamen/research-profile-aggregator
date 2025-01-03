import { PrismaClient, Prisma } from '@prisma/client'
import { Profile, Publication, CreateProfileInput, UpdateProfileInput, CreatePublicationInput, UpdatePublicationInput } from '../types/models.js'

export class ProfileRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async create(data: CreateProfileInput): Promise<Profile> {
    return this.prisma.profile.create({ data, include: {publication: true} })
  }

  async findById(id: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { id }, include: {publication: true} })
  }

  async findByEmail(email: string): Promise<Profile | null>{
    return this.prisma.profile.findUnique({ where: { email }, include: {publication: true} })
  }

  async update(id: string, data: Partial<CreateProfileInput>): Promise<Profile> {
    return this.prisma.profile.update({where: {id}, data, include: {publication: true}})
  }

  async addPublication(profileId: string, data: CreatePublicationInput): Promise<Publication> {
    return this.prisma.publication.create({
        data: {
          ...data,
          profile: {
            connect: { id: profileId }
          }
        }
      })}

    async getPublications(profileId: string): Promise<Publication[]> {
        return this.prisma.publication.findMany({ where: { profileId } })
    }
}