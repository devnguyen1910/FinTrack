import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useFinancials } from '../../context/FinancialContext';
import { Modal } from '../ui/Modal';
import { RecurringTransaction, TransactionType, CategoryName, RecurringFrequency } from '../../types';
import { ICONS } from '../ui/Icons';


const getNextDueDate = (t: RecurringTransaction): Date => {
    const lastDate = new Date(t.lastPostedDate || t.startDate);
    const nextDate = new Date(lastDate);
    
    // Set to start of day to avoid timezone issues
    nextDate.setUTCHours(0, 0, 0, 0);

    switch (t.frequency) {
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
    }
    // If lastPostedDate is not set, the next due date is the start date itself
    if (!t.lastPostedDate) {
        return new Date(t.startDate);
    }

    return nextDate;
};


const RecurringTransactionCard: React.FC<{
    transaction: RecurringTransaction;
    onDelete: (id: string) => void;
    onPost: (transaction: RecurringTransaction, postDate: Date) => void;
}> = ({ transaction, onDelete, onPost }) => {
    const { formatCurrency, getCategoryByName } = useFinancials();
    const category = getCategoryByName(transaction.category);
    const nextDueDate = getNextDueDate(transaction);
    const isDue = nextDueDate <= new Date();
    const frequencyMap = {
        'weekly': 'Hàng tuần',
        'monthly': 'Hàng tháng',
        'yearly': 'Hàng năm'
    };
    
    return (
        <Card className={isDue ? 'border-2 border-primary' : ''}>
            <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                    {category && ICONS[category.icon] && (
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-full">
                            {React.cloneElement(ICONS[category.icon], { className: "h-5 w-5 text-gray-500 dark:text-gray-400" })}
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-lg">{transaction.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category} - {frequencyMap[transaction.frequency]}</p>
                    </div>
                </div>
                <p className={`font-bold text-lg whitespace-nowrap ${transaction.type === TransactionType.INCOME ? 'text-secondary' : 'text-danger'}`}>
                    {transaction.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(transaction.amount)}
                </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2 text-sm">
                <p><strong>Ngày đến hạn tiếp theo:</strong> {nextDueDate.toLocaleDateString('vi-VN')}</p>
                 {transaction.lastPostedDate && <p><strong>Lần cuối tạo:</strong> {new Date(transaction.lastPostedDate).toLocaleDateString('vi-VN')}</p>}
                 {transaction.endDate && <p><strong>Ngày kết thúc:</strong> {new Date(transaction.endDate).toLocaleDateString('vi-VN')}</p>}
            </div>
             <div className="mt-4 flex gap-2">
                <button onClick={() => onPost(transaction, nextDueDate)} className="flex-1 bg-secondary text-white px-3 py-2 rounded-md hover:bg-green-600 text-sm font-semibold disabled:bg-gray-400" disabled={!isDue}>
                    Tạo giao dịch
                </button>
                <button onClick={() => onDelete(transaction.id)} className="bg-danger text-white px-3 py-2 rounded-md hover:bg-red-600 text-sm font-semibold">
                    Xóa
                </button>
            </div>
        </Card>
    );
};


const AddRecurringTransactionModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { addRecurringTransaction, expenseCategories, incomeCategories } = useFinancials();
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [category, setCategory] = useState<CategoryName>('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');
    const [frequency, setFrequency] = useState<RecurringFrequency>('monthly');
    
    React.useEffect(() => {
        if (type === TransactionType.EXPENSE && expenseCategories.length > 0) {
            setCategory(expenseCategories[0].name);
        } else if (type === TransactionType.INCOME && incomeCategories.length > 0) {
            setCategory(incomeCategories[0].name);
        }
    }, [expenseCategories, incomeCategories, isOpen]);

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as TransactionType;
        setType(newType);
        setCategory(newType === TransactionType.EXPENSE ? expenseCategories[0]?.name : incomeCategories[0]?.name || '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !category || !startDate) return;
        addRecurringTransaction({
            type,
            category,
            amount: parseFloat(amount),
            description,
            startDate,
            frequency,
            endDate: endDate || undefined,
        });
        onClose();
    };

    const categories = type === TransactionType.EXPENSE ? expenseCategories : incomeCategories;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Thêm Giao dịch Định kỳ Mới">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Loại</label>
                    <select value={type} onChange={handleTypeChange} className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                        <option value={TransactionType.EXPENSE}>Chi tiêu</option>
                        <option value={TransactionType.INCOME}>Thu nhập</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Danh mục</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                        {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Số tiền</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tần suất</label>
                         <select value={frequency} onChange={e => setFrequency(e.target.value as RecurringFrequency)} className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                            <option value="weekly">Hàng tuần</option>
                            <option value="monthly">Hàng tháng</option>
                            <option value="yearly">Hàng năm</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Mô tả</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="VD: Tiền thuê nhà" className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Ngày bắt đầu</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Ngày kết thúc (tùy chọn)</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                    </div>
                </div>
                <div className="flex justify-end pt-2 space-x-3">
                    <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Hủy</button>
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">Lưu</button>
                </div>
            </form>
        </Modal>
    );
};


export const Recurring: React.FC = () => {
    const { recurringTransactions, deleteRecurringTransaction, addTransaction, updateRecurringTransaction } = useFinancials();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePostTransaction = (transaction: RecurringTransaction, postDate: Date) => {
        addTransaction({
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            description: transaction.description,
            date: postDate.toISOString().split('T')[0],
        });
        
        // Update last posted date
        updateRecurringTransaction({
            ...transaction,
            lastPostedDate: postDate.toISOString().split('T')[0],
        });
    };

    const sortedTransactions = [...recurringTransactions].sort((a,b) => {
        return getNextDueDate(a).getTime() - getNextDueDate(b).getTime();
    });

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Giao dịch Định kỳ</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm mới
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTransactions.map(t => (
                    <RecurringTransactionCard 
                        key={t.id} 
                        transaction={t} 
                        onDelete={deleteRecurringTransaction}
                        onPost={handlePostTransaction}
                    />
                ))}
            </div>
            {recurringTransactions.length === 0 && (
                <Card>
                    <p className="text-center py-8 text-gray-500">Bạn chưa có giao dịch định kỳ nào. Hãy thêm một khoản chi tiêu hoặc thu nhập lặp lại để theo dõi!</p>
                </Card>
            )}
            <AddRecurringTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};