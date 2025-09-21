import express from 'express';
import { body, param, query } from 'express-validator';
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '../controllers/transactionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Validation middleware
const transactionValidation = [
  body('type')
    .isIn(['INCOME', 'EXPENSE'])
    .withMessage('Type must be either INCOME or EXPENSE'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('priority')
    .optional()
    .isIn(['High', 'Medium', 'Low'])
    .withMessage('Priority must be High, Medium, or Low')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid transaction ID')
];

// Routes
router.get('/', getTransactions);
router.post('/', transactionValidation, createTransaction);
router.put('/:id', idValidation, transactionValidation, updateTransaction);
router.delete('/:id', idValidation, deleteTransaction);

export default router;