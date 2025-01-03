// src/services/profile.service.ts

import { ProfileRepository } from "../repositories/profile.repository.js";
import { Profile, Publication} from "../types/models.js";

export class ProfileService {
  private profileRepository: ProfileRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  async createProfile(data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> {
    try{
      const profile = await this.profileRepository.create(data);
      return profile;
    } catch (error) {
      throw new Error('Failed to create profile');
    }
  }

  async getProfile(id: string): Promise<Profile | null> {
    try{
      const profile = await this.profileRepository.findById(id);
      if (!profile) {
        throw new Error('Profile not found');
      }
      return profile;
    } catch (error) {
      throw new Error('Profile not found');
    }
  }

  async getPublications(id: string): Promise<Publication[]> {
    try{
      const publications = await this.profileRepository.getPublications(id);
      return publications;
    } catch (error) {
      throw new Error('Failed to fetch publications');
    }
  }
}