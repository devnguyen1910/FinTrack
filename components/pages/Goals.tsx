import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useFinancials } from '../../context/FinancialContext';
import { Modal } from '../ui/Modal';
import { Goal } from '../../types';

const GoalCard: React.FC<{ goal: Goal, onAddFunds: (id: string, amount: number) => void, onDelete: (id: string) => void }> = ({ goal, onAddFunds, onDelete }) => {
    const { formatCurrency } = useFinancials();
    const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    const [addAmount, setAddAmount] = useState('');

    const handleAddFunds = () => {
        const amount = parseFloat(addAmount);
        if (amount > 0) {
            onAddFunds(goal.id, amount);
            setAddAmount('');
        }
    };
    
    return (
        <Card>
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg">{goal.name}</h4>
                <button onClick={() => onDelete(goal.id)} className="text-red-500 hover:text-red-700" aria-label={`Xóa mục tiêu ${goal.name}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-3">Mục tiêu: {formatCurrency(goal.targetAmount)}</p>
             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                <div className="bg-primary h-4 rounded-full text-white text-xs flex items-center justify-center" style={{ width: `${Math.min(percentage, 100)}%` }}>
                    {percentage.toFixed(0)}%
                </div>
            </div>
            <p className="mt-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                Đã tiết kiệm: {formatCurrency(goal.currentAmount)}
            </p>
            <div className="mt-4 flex space-x-2">
                <input 
                    type="number"
                    value={addAmount}
                    onChange={e => setAddAmount(e.target.value)}
                    placeholder="Số tiền thêm"
                    aria-label={`Thêm tiền cho mục tiêu ${goal.name}`}
                    className="flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                />
                <button onClick={handleAddFunds} className="bg-secondary text-white px-3 py-2 rounded-md hover:bg-green-600 text-sm font-semibold">Thêm</button>
            </div>
        </Card>
    );
};

const AddGoalModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { addGoal } = useFinancials();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !targetAmount) return;
        addGoal({
            name,
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount) || 0,
        });
        onClose();
        setName('');
        setTargetAmount('');
        setCurrentAmount('');
    };

    return (
         <Modal isOpen={isOpen} onClose={onClose} title="Thêm Mục tiêu mới">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên mục tiêu</label>
                    <input id="goalName" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Mua điện thoại mới" className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required/>
                </div>
                <div>
                    <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số tiền mục tiêu</label>
                    <input id="targetAmount" type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="0" className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required/>
                </div>
                 <div>
                    <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số tiền đã có</label>
                    <input id="currentAmount" type="number" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} placeholder="0" className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                 <div className="flex justify-end pt-2 space-x-3">
                    <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Hủy</button>
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">Thêm</button>
                </div>
            </form>
         </Modal>
    );
};


export const Goals: React.FC = () => {
    const { goals, updateGoal, deleteGoal } = useFinancials();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddFunds = (id: string, amount: number) => {
        const goal = goals.find(g => g.id === id);
        if (goal) {
            const newAmount = goal.currentAmount + amount;
            updateGoal({ ...goal, currentAmount: newAmount > goal.targetAmount ? goal.targetAmount : newAmount });
        }
    };
    
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Mục tiêu tiết kiệm</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm mục tiêu
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(g => <GoalCard key={g.id} goal={g} onAddFunds={handleAddFunds} onDelete={deleteGoal} />)}
            </div>
            {goals.length === 0 && (
                <Card>
                    <p className="text-center py-8 text-gray-500">Chưa có mục tiêu nào được đặt ra. Hãy tạo một mục tiêu để bắt đầu tiết kiệm!</p>
                </Card>
            )}
            <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};
