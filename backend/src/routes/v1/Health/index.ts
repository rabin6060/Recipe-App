import { Router } from 'express';
import HealthController from './health.controller';

const router = Router();

router.route('/').get(HealthController.healthCheck);

export default router;
