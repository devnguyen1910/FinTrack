import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

router.get('/', (req: any, res: any) => {
  res.json({ success: true, message: 'Goals endpoint', data: [] });
});

export default router;