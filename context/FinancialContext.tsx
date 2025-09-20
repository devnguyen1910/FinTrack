import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Transaction, Budget, Goal, TransactionType, Category, CategoryName, Loan, Debt, Currency, RecurringTransaction } from '../types';

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

interface FinancialContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (updatedTransaction: Transaction) => void;
  addMultipleTransactions: (transactions: Omit<Transaction, 'id'>[]) => void;
  deleteTransaction: (id: string) => void;
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (updatedBudget: Budget) => void;
  deleteBudget: (id: string) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (updatedGoal: Goal) => void;
  deleteGoal: (id: string) => void;
  expenseCategories: Category[];
  incomeCategories: Category[];
  addCategory: (category: Category, type: TransactionType) => void;
  updateCategory: (oldName: CategoryName, newCategory: Category, type: TransactionType) => void;
  deleteCategory: (name: CategoryName, type: TransactionType) => void;
  getCategoryByName: (name: CategoryName) => Category | undefined;
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  deleteLoan: (id: string) => void;
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  deleteDebt: (id: string) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
  recurringTransactions: RecurringTransaction[];
  addRecurringTransaction: (transaction: Omit<RecurringTransaction, 'id'>) => void;
  updateRecurringTransaction: (updatedTransaction: RecurringTransaction) => void;
  deleteRecurringTransaction: (id: string) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [expenseCategories, setExpenseCategories] = useLocalStorage<Category[]>('expenseCategories', DEFAULT_EXPENSE_CATEGORIES);
  const [incomeCategories, setIncomeCategories] = useLocalStorage<Category[]>('incomeCategories', DEFAULT_INCOME_CATEGORIES);
  const [loans, setLoans] = useLocalStorage<Loan[]>('loans', []);
  const [debts, setDebts] = useLocalStorage<Debt[]>('debts', []);
  const [currency, setCurrency] = useLocalStorage<Currency>('currency', 'VND');
  const [recurringTransactions, setRecurringTransactions] = useLocalStorage<RecurringTransaction[]>('recurringTransactions', []);

  const formatCurrency = useCallback((amount: number): string => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }
    // Default to VND
    return `${amount.toLocaleString('vi-VN')} VND`;
  }, [currency]);
  
  const getCategoryByName = useCallback((name: CategoryName): Category | undefined => {
    const allCategories = [...expenseCategories, ...incomeCategories];
    return allCategories.find(c => c.name === name);
  }, [expenseCategories, incomeCategories]);


  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    setTransactions(prev => [...prev, newTransaction]);
  };
  
  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };

  const addMultipleTransactions = (newTransactions: Omit<Transaction, 'id'>[]) => {
    const transactionsWithIds = newTransactions.map(t => ({ ...t, id: crypto.randomUUID() }));
    setTransactions(prev => [...prev, ...transactionsWithIds]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget = { ...budget, id: crypto.randomUUID(), spent: 0 };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (updatedBudget: Budget) => {
    setBudgets(prev => prev.map(b => b.id === updatedBudget.id ? updatedBudget : b));
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = { ...goal, id: crypto.randomUUID() };
    setGoals(prev => [...prev, newGoal]);
  };
  
  const updateGoal = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addCategory = (category: Category, type: TransactionType) => {
    if (type === TransactionType.EXPENSE) {
      setExpenseCategories(prev => [...prev, category]);
    } else {
      setIncomeCategories(prev => [...prev, category]);
    }
  };

  const updateCategory = (oldName: CategoryName, newCategory: Category, type: TransactionType) => {
    if (type === TransactionType.EXPENSE) {
      setExpenseCategories(prev => prev.map(c => c.name === oldName ? newCategory : c));
      // Update in transactions and budgets if name changed
      if (oldName !== newCategory.name) {
        setTransactions(prev => prev.map(t => (t.type === TransactionType.EXPENSE && t.category === oldName) ? { ...t, category: newCategory.name } : t));
        setBudgets(prev => prev.map(b => b.category === oldName ? { ...b, category: newCategory.name } : b));
        setRecurringTransactions(prev => prev.map(t => (t.type === TransactionType.EXPENSE && t.category === oldName) ? { ...t, category: newCategory.name } : t));
      }
    } else {
      setIncomeCategories(prev => prev.map(c => c.name === oldName ? newCategory : c));
       // Update in transactions if name changed
      if (oldName !== newCategory.name) {
        setTransactions(prev => prev.map(t => (t.type === TransactionType.INCOME && t.category === oldName) ? { ...t, category: newCategory.name } : t));
        setRecurringTransactions(prev => prev.map(t => (t.type === TransactionType.INCOME && t.category === oldName) ? { ...t, category: newCategory.name } : t));
      }
    }
  };

  const deleteCategory = (name: CategoryName, type: TransactionType) => {
    if (type === TransactionType.EXPENSE) {
      setExpenseCategories(prev => prev.filter(c => c.name !== name));
    } else {
      setIncomeCategories(prev => prev.filter(c => c.name !== name));
    }
  };

  const addLoan = (loan: Omit<Loan, 'id'>) => {
    const newLoan = { ...loan, id: crypto.randomUUID() };
    setLoans(prev => [...prev, newLoan]);
  };

  const deleteLoan = (id: string) => {
      setLoans(prev => prev.filter(l => l.id !== id));
  };

  const addDebt = (debt: Omit<Debt, 'id'>) => {
      const newDebt = { ...debt, id: crypto.randomUUID() };
      setDebts(prev => [...prev, newDebt]);
  };

  const deleteDebt = (id: string) => {
      setDebts(prev => prev.filter(d => d.id !== id));
  };

  const addRecurringTransaction = (transaction: Omit<RecurringTransaction, 'id'>) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    setRecurringTransactions(prev => [...prev, newTransaction]);
  };

  const updateRecurringTransaction = (updatedTransaction: RecurringTransaction) => {
    setRecurringTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };

  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(prev => prev.filter(t => t.id !== id));
  };

  const getUpdatedBudgets = () => {
     return budgets.map(budget => {
        const spent = transactions
            .filter(t => t.type === TransactionType.EXPENSE && t.category === budget.category)
            .reduce((sum, t) => sum + t.amount, 0);
        return { ...budget, spent };
     });
  };

  const value = {
    transactions,
    addTransaction,
    updateTransaction,
    addMultipleTransactions,
    deleteTransaction,
    budgets: getUpdatedBudgets(),
    addBudget,
    updateBudget,
    deleteBudget,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    expenseCategories,
    incomeCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryByName,
    loans,
    addLoan,
    deleteLoan,
    debts,
    addDebt,
    deleteDebt,
    currency,
    setCurrency,
    formatCurrency,
    recurringTransactions,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancials = (): FinancialContextType => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancials must be used within a FinancialProvider');
  }
  return context;
};