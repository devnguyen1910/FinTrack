import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal } from './Modal';
import { useFinancials } from '../../context/FinancialContext';
import { TransactionType, CategoryName, Transaction, TransactionPriority } from '../../types';
import { suggestCategory } from '../../services/geminiService';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<Omit<Transaction, 'id'>>;
  transactionToEdit?: Transaction | null;
}

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, initialData, transactionToEdit }) => {
  const { addTransaction, updateTransaction, expenseCategories, incomeCategories } = useFinancials();
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<CategoryName>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptImage, setReceiptImage] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<TransactionPriority>('Low');
  
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const receiptInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!transactionToEdit;
  const debouncedDescription = useDebounce(description, 500);

  const getCategories = useCallback(() => type === TransactionType.EXPENSE ? expenseCategories : incomeCategories, [type, expenseCategories, incomeCategories]);

  useEffect(() => {
    const fetchSuggestion = async () => {
        if (debouncedDescription.length > 3 && type === TransactionType.EXPENSE && !isEditMode) {
            setIsSuggesting(true);
            const categoryNames = getCategories().map(c => c.name);
            const suggestion = await suggestCategory(debouncedDescription, categoryNames);
            if (suggestion) {
                setSuggestedCategory(suggestion);
            }
            setIsSuggesting(false);
        } else {
            setSuggestedCategory('');
        }
    };
    fetchSuggestion();
  }, [debouncedDescription, type, getCategories, isEditMode]);

  const resetForm = useCallback(() => {
    const cats = getCategories();
    setType(TransactionType.EXPENSE);
    setCategory(cats[0]?.name || '');
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setReceiptImage(undefined);
    setPriority('Low');
    setSuggestedCategory('');
    setIsSuggesting(false);
  }, [getCategories]);


  useEffect(() => {
    if (isOpen) {
        const data = transactionToEdit || initialData;
        if (data) {
            const initialType = data.type || TransactionType.EXPENSE;
            const relevantCategories = initialType === TransactionType.EXPENSE ? expenseCategories : incomeCategories;
            
            setType(initialType);
            setCategory(data.category && relevantCategories.some(c => c.name === data.category) ? data.category : relevantCategories[0]?.name || '');
            setAmount(data.amount?.toString() || '');
            setDescription(data.description || '');
            setDate(data.date || new Date().toISOString().split('T')[0]);
            setReceiptImage(transactionToEdit?.receiptImage);
            setPriority(data.priority || 'Low');
        } else {
            resetForm();
        }
    }
  }, [initialData, transactionToEdit, isOpen, expenseCategories, incomeCategories, resetForm]);


  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const cats = newType === TransactionType.EXPENSE ? expenseCategories : incomeCategories;
    setCategory(cats[0]?.name || '');
  };

  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setReceiptImage(reader.result as string);
          reader.readAsDataURL(file);
      }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category || !date) return;

    const transactionData = { type, category, amount: parseFloat(amount), description, date, receiptImage, priority };
    if (isEditMode) {
        updateTransaction({ ...transactionData, id: transactionToEdit.id });
    } else {
        addTransaction(transactionData);
    }
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Chỉnh sửa giao dịch" : "Thêm giao dịch mới"}>
       <input
            type="file" accept="image/*" ref={receiptInputRef} onChange={handleReceiptChange}
            className="hidden" aria-hidden="true"
        />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-2 rounded-lg bg-gray-200 dark:bg-dark p-1">
            <button type="button" onClick={() => handleTypeChange(TransactionType.EXPENSE)} className={`w-full p-2 text-sm font-semibold rounded-md transition ${type === TransactionType.EXPENSE ? 'bg-danger text-white' : 'hover:bg-gray-300 dark:hover:bg-dark-secondary'}`}>Chi tiêu</button>
            <button type="button" onClick={() => handleTypeChange(TransactionType.INCOME)} className={`w-full p-2 text-sm font-semibold rounded-md transition ${type === TransactionType.INCOME ? 'bg-secondary text-white' : 'hover:bg-gray-300 dark:hover:bg-dark-secondary'}`}>Thu nhập</button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="VD: Ăn trưa cùng đồng nghiệp" className="block w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required/>
          {isSuggesting && <p className="text-xs text-gray-500 mt-1">AI đang gợi ý danh mục...</p>}
          {suggestedCategory && category !== suggestedCategory && (
            <div className="mt-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Gợi ý: </span>
                <button type="button" onClick={() => setCategory(suggestedCategory)} className="px-2 py-0.5 bg-primary/20 text-primary font-semibold rounded-full hover:bg-primary/30">
                    {suggestedCategory}
                </button>
            </div>
           )}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
              <select value={category} onChange={e => setCategory(e.target.value as CategoryName)} className="block w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                {getCategories().map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số tiền</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="block w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required/>
            </div>
        </div>
       
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày</label>
                <input id="date-input" type="date" title="Chọn ngày giao dịch" value={date} onChange={e => setDate(e.target.value)} className="block w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required/>
            </div>
            <div>
                <label htmlFor="priority-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Độ ưu tiên</label>
                <select id="priority-select" title="Chọn độ ưu tiên" value={priority} onChange={e => setPriority(e.target.value as TransactionPriority)} className="block w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2">
                    <option value="Low">Thấp</option>
                    <option value="Medium">Trung bình</option>
                    <option value="High">Cao</option>
                </select>
            </div>
        </div>

        <div>
            {receiptImage ? (
                <div className="relative group w-32 h-32">
                    <img src={receiptImage} alt="Xem trước hóa đơn" className="w-full h-full object-cover rounded-md border border-gray-300 dark:border-gray-600" />
                    <button type="button" title="Xóa hình ảnh" onClick={() => setReceiptImage(undefined)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            ) : (
                <button type="button" onClick={() => receiptInputRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center text-gray-500 hover:border-primary hover:text-primary transition-colors">
                    Đính kèm Hóa đơn
                </button>
            )}
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t dark:border-gray-700">
            <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Hủy</button>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">{isEditMode ? 'Lưu thay đổi' : 'Thêm'}</button>
        </div>
      </form>
    </Modal>
  );
};