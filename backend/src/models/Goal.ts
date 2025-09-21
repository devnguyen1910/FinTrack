import mongoose from 'mongoose';
import { IGoal } from '../types';

const goalSchema = new mongoose.Schema<IGoal>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Goal name is required'],
    trim: true,
    maxlength: [100, 'Goal name cannot exceed 100 characters']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0, 'Target amount must be positive']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  deadline: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

goalSchema.index({ userId: 1, isCompleted: 1 });

export const Goal = mongoose.model<IGoal>('Goal', goalSchema);