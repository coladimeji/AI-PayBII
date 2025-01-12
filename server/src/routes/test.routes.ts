// src/routes/test.routes.ts
import { Router } from 'express';
import { 
  createTest, 
  getAllTests, 
  getTestById 
} from '../controllers/test.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createTestSchema } from '../utils/validation-schemas';

const router = Router();

router.use(protect); // Protect all routes

router.route('/')
  .get(getAllTests)
  .post(validateRequest(createTestSchema), createTest);

router.route('/:id')
  .get(getTestById);

export default router;