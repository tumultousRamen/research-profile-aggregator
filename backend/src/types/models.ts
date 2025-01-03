// src/types/models.ts
import { Prisma } from '@prisma/client'

// Base type for Profile
export type Profile = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  institution?: string | null
  department?: string | null
  title?: string | null
  email?: string | null
  researchAreas: string[]
  scholarProfileUrl?: string | null
  arXivId?: string | null
  orcidId?: string | null
  hIndex?: number | null
  citationCount?: number | null
  publications?: Publication[]
}

// Base type for Publication
export type Publication = {
  id: string
  createdAt: Date
  updatedAt: Date
  title: string
  abstract?: string | null
  publishedDate?: Date | null
  venue?: string | null
  doi?: string | null
  url?: string | null
  citationCount?: number | null
  profileId: string
  profile?: Profile
}

// Input types for creating/updating profiles
export type CreateProfileInput = Omit<Profile, 'id' | 'createdAt' | 'updatedAt' | 'publications'>
export type UpdateProfileInput = Partial<CreateProfileInput>

// Input types for creating/updating publications
export type CreatePublicationInput = Omit<Publication, 'id' | 'createdAt' | 'updatedAt' | 'profile'>
export type UpdatePublicationInput = Partial<CreatePublicationInput>