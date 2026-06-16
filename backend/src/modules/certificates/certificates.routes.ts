import { Router } from 'express';
import { getCertificates } from './certificates.controller';
const router = Router();
router.get('/:productSlug', getCertificates);
export default router;
