import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { useFinancials } from '../../context/FinancialContext';
import { Modal } from '../ui/Modal';
import { Budget, CategoryName } from '../../types';
import { ICONS } from '../ui/Icons';

const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    let colorClass = 'bg-secondary';
    if (percentage > 100) {
        colorClass = 'bg-danger';
    } else if (percentage > 80) {
        colorClass = 'bg-warning';
    }
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
        </div>
    );
};

const BudgetCard: React.FC<{ budget: Budget; onDelete: (id: string) => void; }> = ({ budget, onDelete }) => {
    const { formatCurrency, getCategoryByName } = useFinancials();
    const remaining = budget.amount - budget.spent;
    const isOverspent = budget.spent > budget.amount;
    const category = getCategoryByName(budget.category);
    
    return (
        <Card className={isOverspent ? 'border border-danger bg-red-50 dark:bg-red-900/20' : ''}>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    {category && ICONS[category.icon] && (
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-full">
                            {React.cloneElement(ICONS[category.icon], { className: "h-5 w-5 text-gray-500 dark:text-gray-400" })}
                        </div>
                    )}
                    <div>
                        <h4 className="font-bold text-lg">{budget.category}</h4>
                        {isOverspent && (
                            <span className="text-xs text-danger font-semibold">Đã vượt mức!</span>
                        )}
                    </div>
                </div>
                 <button onClick={() => onDelete(budget.id)} className="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
            <div className="my-3">
                <ProgressBar value={budget.spent} max={budget.amount} />
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Đã chi: {formatCurrency(budget.spent)}</span>
                <span>/ {formatCurrency(budget.amount)}</span>
            </div>
            <p className={`mt-2 font-semibold ${remaining >= 0 ? 'text-gray-700 dark:text-gray-300' : 'text-danger'}`}>
                {remaining >= 0 ? `Còn lại: ${formatCurrency(remaining)}` : `Vượt mức: ${formatCurrency(Math.abs(remaining))}`}
            </p>
        </Card>
    );
};

const AddBudgetModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { addBudget, budgets, expenseCategories } = useFinancials();
    const [category, setCategory] = useState<CategoryName>('');
    const [amount, setAmount] = useState('');

    const existingCategories = budgets.map(b => b.category);
    const availableCategories = expenseCategories.filter(c => !existingCategories.includes(c.name));
    
    useEffect(() => {
        if (availableCategories.length > 0) {
            setCategory(availableCategories[0].name);
        }
    }, [expenseCategories, budgets]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category) return;
        addBudget({
            category,
            amount: parseFloat(amount),
        });
        onClose();
        setAmount('');
        if(availableCategories.length > 1) {
            setCategory(availableCategories[1].name);
        } else {
            setCategory('');
        }
    };

    return (
         <Modal isOpen={isOpen} onClose={onClose} title="Thêm Ngân sách mới">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Danh mục</label>
                    <select value={category} onChange={e => setCategory(e.target.value as CategoryName)} className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                        {availableCategories.length > 0 ? (
                            availableCategories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)
                        ) : (
                            <option disabled>Tất cả danh mục đã có ngân sách</option>
                        )}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hạn mức</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required/>
                </div>
                 <div className="flex justify-end space-x-3 pt-5">
                    <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Hủy</button>
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark" disabled={availableCategories.length === 0}>Thêm</button>
                </div>
            </form>
         </Modal>
    );
};

export const Budgets: React.FC = () => {
    const { budgets, deleteBudget } = useFinancials();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Ngân sách chi tiêu</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm ngân sách
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map(b => <BudgetCard key={b.id} budget={b} onDelete={deleteBudget} />)}
            </div>
            {budgets.length === 0 && (
                <Card>
                    <p className="text-center py-8 text-gray-500">Bạn chưa đặt ngân sách nào. Hãy bắt đầu theo dõi chi tiêu!</p>
                </Card>
            )}
            <AddBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};