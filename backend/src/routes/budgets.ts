import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();
router.use(authenticate);

// Placeholder routes - will be implemented based on frontend requirements
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Budgets endpoint', data: [] });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Budget created' });
});

export default router;