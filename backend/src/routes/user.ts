import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

router.get('/profile', (req: any, res: any) => {
  res.json({ success: true, message: 'User profile endpoint', data: {} });
});

export default router;