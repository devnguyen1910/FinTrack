import React from 'react';
import { Modal } from './Modal';
import { Transaction, TransactionType } from '../../types';
import { useFinancials } from '../../context/FinancialContext';
import { ICONS } from './Icons';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ isOpen, onClose, transaction, onDelete, onEdit }) => {
  const { formatCurrency, getCategoryByName } = useFinancials();

  if (!transaction) return null;

  const category = getCategoryByName(transaction.category);
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? 'text-secondary' : 'text-danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Giao dịch">
      <div className="space-y-4">
        {transaction.receiptImage && (
            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Hóa đơn đính kèm</h4>
                <img src={transaction.receiptImage} alt="Hóa đơn" className="w-full max-h-60 object-contain rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark" />
            </div>
        )}

        <div className="flex items-center gap-4 p-3 bg-light dark:bg-dark rounded-lg">
            {category && ICONS[category.icon] && (
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                    {React.cloneElement(ICONS[category.icon], { className: "h-6 w-6 text-gray-600 dark:text-gray-300" })}
                </div>
            )}
            <div>
                <p className="font-bold text-xl">{transaction.description}</p>
                <p className="text-md text-gray-500 dark:text-gray-400">{transaction.category}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-light dark:bg-dark rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Số tiền</p>
                <p className={`font-bold text-2xl ${amountColor}`}>
                    {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                </p>
            </div>
             <div className="p-3 bg-light dark:bg-dark rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày</p>
                <p className="font-bold text-lg">
                    {new Date(transaction.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
        </div>
        
         <div className="p-3 bg-light dark:bg-dark rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loại giao dịch</p>
            <p className={`font-semibold ${amountColor}`}>
                {isIncome ? 'Thu nhập' : 'Chi tiêu'}
            </p>
        </div>


        <div className="flex justify-end space-x-3 pt-4">
          <button 
            onClick={() => onEdit(transaction)} 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-semibold"
            aria-label="Chỉnh sửa giao dịch"
            >
            Chỉnh sửa
          </button>
          <button 
            onClick={() => onDelete(transaction.id)} 
            className="bg-danger text-white px-4 py-2 rounded-md hover:bg-red-600 font-semibold"
            aria-label="Xóa giao dịch"
            >
            Xóa
          </button>
        </div>
      </div>
    </Modal>
  );
};
