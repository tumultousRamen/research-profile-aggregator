import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';

const router = Router();
const profileController = new ProfileController();

router.post('/', profileController.createProfile);
router.get('/:id', profileController.getProfile);
router.get('/:id/publications', profileController.getPublications);
// router.get('/:id/summary', profileController.getSummary);

export { router as profileRoutes };