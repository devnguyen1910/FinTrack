export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Category {
  name: string;
  icon: string; // keyof typeof ICONS
}

export type CategoryName = string;

export type TransactionPriority = 'High' | 'Medium' | 'Low';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: CategoryName;
  amount: number;
  description: string;
  date: string; // ISO 8601 format
  receiptImage?: string; // Base64 data URL
  priority?: TransactionPriority;
}

export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly';

export interface RecurringTransaction {
  id: string;
  type: TransactionType;
  category: CategoryName;
  amount: number;
  description: string;
  startDate: string; // ISO 8601 format
  frequency: RecurringFrequency;
  endDate?: string; // ISO 8601 format
  lastPostedDate?: string; // ISO 8601 format
}

export interface Budget {
  id: string;
  category: CategoryName;
  amount: number;
  spent: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface Loan {
  id:string;
  name: string;
  principal: number;
  interestRate: number; // as a percentage
  maturityDate: string; // ISO 8601 format
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // ISO 8601 format
}

export type Currency = 'VND' | 'USD';

export interface ReportData {
  total: number;
  byCategory: { name: string; value: number }[];
  trend: { date: string; amount: number }[];
  budgetComparison?: (Budget & { status: 'overspent' | 'on-track' })[];
  monthlyComparison?: { [key: string]: string | number }[];
  comparisonMonths?: string[];
}