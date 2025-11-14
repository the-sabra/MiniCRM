import { Router } from 'express';
import healthRoutes from './health.routes';
import propertyRoutes from './property.routes';
const router = Router();

// Health check route
router.use('/health', healthRoutes);
router.use('/properties', propertyRoutes);

export default router;
