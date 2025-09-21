import mongoose from 'mongoose';
import { IBudget } from '../types';

const budgetSchema = new mongoose.Schema<IBudget>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount must be positive']
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount cannot be negative']
  },
  period: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
    validate: {
      validator: function(this: IBudget, value: number) {
        return this.period === 'yearly' || (value >= 1 && value <= 12);
      },
      message: 'Month is required for monthly budgets'
    }
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [2020, 'Year must be 2020 or later']
  }
}, {
  timestamps: true
});

// Ensure unique budget per category per period
budgetSchema.index({ userId: 1, category: 1, period: 1, month: 1, year: 1 }, { unique: true });

export const Budget = mongoose.model<IBudget>('Budget', budgetSchema);