import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { Budget } from '../models/Budget';
import { ApiResponse, TransactionQuery } from '../types';

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const {
      page = 1,
      limit = 20,
      type,
      category,
      startDate,
      endDate,
      sort = 'date',
      order = 'desc'
    } = req.query as any;

    // Build query
    const query: any = { userId };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort configuration
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions: any = { [sort]: sortOrder };

    // Execute query
    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Transaction.countDocuments(query)
    ]);

    res.json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const transactionData = { ...req.body, userId };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    // Update budget if it's an expense
    if (transaction.type === 'EXPENSE') {
      await updateBudgetSpent(userId, transaction.category, transaction.amount);
    }

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: { transaction }
    } as ApiResponse);

  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const oldTransaction = await Transaction.findOne({ _id: id, userId });
    if (!oldTransaction) {
      res.status(404).json({
        success: false,
        message: 'Transaction not found'
      } as ApiResponse);
      return;
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    // Update budgets if needed
    if (oldTransaction.type === 'EXPENSE') {
      await updateBudgetSpent(userId, oldTransaction.category, -oldTransaction.amount);
    }
    if (updatedTransaction!.type === 'EXPENSE') {
      await updateBudgetSpent(userId, updatedTransaction!.category, updatedTransaction!.amount);
    }

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: { transaction: updatedTransaction }
    } as ApiResponse);

  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });
    if (!transaction) {
      res.status(404).json({
        success: false,
        message: 'Transaction not found'
      } as ApiResponse);
      return;
    }

    // Update budget if it was an expense
    if (transaction.type === 'EXPENSE') {
      await updateBudgetSpent(userId, transaction.category, -transaction.amount);
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

// Helper function to update budget spent amount
const updateBudgetSpent = async (userId: string, category: string, amount: number) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  await Budget.findOneAndUpdate(
    { 
      userId, 
      category, 
      year: currentYear,
      month: currentMonth 
    },
    { $inc: { spent: amount } },
    { upsert: false }
  );
};