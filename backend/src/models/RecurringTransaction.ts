import mongoose from 'mongoose';
import { IRecurringTransaction, TransactionType, RecurringFrequency } from '../types';

const recurringTransactionSchema = new mongoose.Schema<IRecurringTransaction>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  type: {
    type: String,
    enum: Object.values(TransactionType),
    required: [true, 'Transaction type is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  frequency: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    required: [true, 'Frequency is required']
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(this: IRecurringTransaction, value: Date) {
        return !value || value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  lastPostedDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

recurringTransactionSchema.index({ userId: 1, isActive: 1 });
recurringTransactionSchema.index({ userId: 1, startDate: 1 });

export const RecurringTransaction = mongoose.model<IRecurringTransaction>('RecurringTransaction', recurringTransactionSchema);