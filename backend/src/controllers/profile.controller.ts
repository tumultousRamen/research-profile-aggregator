import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service';

export class ProfileController {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  createProfile = async (req: Request, res: Response) => {
    try {
      const profile = await this.profileService.createProfile(req.body);
      res.status(201).json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create profile' });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const profile = await this.profileService.getProfile(req.params.id);
      res.json(profile);
    } catch (error) {
      res.status(404).json({ error: 'Profile not found' });
    }
  };

  getPublications = async (req: Request, res: Response) => {
    try {
      const publications = await this.profileService.getPublications(req.params.id);
      res.json(publications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch publications' });
    }
  };

  // getSummary = async (req: Request, res: Response) => {
  //   try {
  //     const summary = await this.profileService.getSummary(req.params.id);
  //     res.json(summary);
  //   } catch (error) {
  //     res.status(500).json({ error: 'Failed to generate summary' });
  //   }
  // };
}