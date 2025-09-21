export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Category {
  name: string;
  icon: string;
}

export type CategoryName = string;
export type TransactionPriority = 'High' | 'Medium' | 'Low';
export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly';
export type Currency = 'VND' | 'USD' | 'EUR';

export interface ITransaction {
  _id?: string;
  userId: string;
  type: TransactionType;
  category: CategoryName;
  amount: number;
  description: string;
  date: Date;
  receiptImage?: string;
  priority?: TransactionPriority;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRecurringTransaction {
  _id?: string;
  userId: string;
  type: TransactionType;
  category: CategoryName;
  amount: number;
  description: string;
  startDate: Date;
  frequency: RecurringFrequency;
  endDate?: Date;
  lastPostedDate?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBudget {
  _id?: string;
  userId: string;
  category: CategoryName;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  month?: number; // 1-12 for monthly budgets
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGoal {
  _id?: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  isCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILoan {
  _id?: string;
  userId: string;
  name: string;
  amount: number;
  interestRate: number;
  monthlyPayment: number;
  remainingBalance: number;
  startDate: Date;
  endDate?: Date;
  isPaidOff: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDebt {
  _id?: string;
  userId: string;
  name: string;
  amount: number;
  interestRate?: number;
  minimumPayment?: number;
  remainingBalance: number;
  dueDate?: Date;
  isPaidOff: boolean;
  creditor?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  currency: Currency;
  expenseCategories: Category[];
  incomeCategories: Category[];
  isEmailVerified: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface TransactionQuery extends PaginationQuery {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}