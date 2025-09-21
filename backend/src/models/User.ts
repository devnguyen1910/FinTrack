import mongoose from 'mongoose';
import { IUser, Currency, Category } from '../types';
import bcrypt from 'bcryptjs';

const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { name: 'Ăn uống', icon: 'food' },
  { name: 'Di chuyển', icon: 'transport' },
  { name: 'Nhà ở', icon: 'housing' },
  { name: 'Tiện ích', icon: 'utilities' },
  { name: 'Hóa đơn & Dịch vụ', icon: 'default' },
  { name: 'Mua sắm', icon: 'shopping' },
  { name: 'Giải trí', icon: 'entertainment' },
  { name: 'Sức khỏe', icon: 'health' },
  { name: 'Giáo dục', icon: 'education' },
  { name: 'Gia đình & Con cái', icon: 'default' },
  { name: 'Đầu tư & Tiết kiệm', icon: 'investment' },
  { name: 'Du lịch', icon: 'default' },
  { name: 'Quà tặng & Từ thiện', icon: 'gift' },
  { name: 'Khác', icon: 'default' }
];

const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { name: 'Lương', icon: 'salary' },
  { name: 'Thưởng', icon: 'bonus' },
  { name: 'Kinh doanh', icon: 'default' },
  { name: 'Đầu tư', icon: 'investment' },
  { name: 'Làm thêm', icon: 'default' },
  { name: 'Quà tặng', icon: 'gift' },
  { name: 'Khác', icon: 'default' }
];

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  currency: {
    type: String,
    enum: ['VND', 'USD', 'EUR'],
    default: 'VND'
  },
  expenseCategories: {
    type: [{
      name: { type: String, required: true },
      icon: { type: String, required: true }
    }],
    default: DEFAULT_EXPENSE_CATEGORIES
  },
  incomeCategories: {
    type: [{
      name: { type: String, required: true },
      icon: { type: String, required: true }
    }],
    default: DEFAULT_INCOME_CATEGORIES
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = mongoose.model<IUser>('User', userSchema);