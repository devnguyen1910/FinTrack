import React, { useState, useRef, useMemo } from 'react';
import { Card } from '../ui/Card';
import { useFinancials } from '../../context/FinancialContext';
import { AddTransactionModal } from '../ui/AddTransactionModal';
import { TransactionDetailModal } from '../ui/TransactionDetailModal';
import { Transaction, TransactionType } from '../../types';
import { analyzeBillImage } from '../../services/geminiService';
import { ICONS } from '../ui/Icons';

const PaperclipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a3 3 0 10-6 0v4a1 1 0 102 0V7a1 1 0 112 0v4a3 3 0 11-6 0V7a5 5 0 0110 0v4a7 7 0 11-14 0V7a3 3 0 013-3z" clipRule="evenodd" />
    </svg>
);

const TransactionCard: React.FC<{ transaction: Transaction, onClick: (t: Transaction) => void }> = ({ transaction, onClick }) => {
    const { formatCurrency, getCategoryByName } = useFinancials();
    const category = getCategoryByName(transaction.category);
    return (
        <div 
            className="bg-white dark:bg-dark-secondary p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onClick(transaction)}
            role="button"
            tabIndex={0}
            aria-label={`Xem chi tiết giao dịch ${transaction.description}`}
        >
            <div className="flex justify-between items-start gap-3">
                 <div className="flex items-center gap-3">
                    {category && ICONS[category.icon] && (
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-full">
                            {React.cloneElement(ICONS[category.icon], { className: "h-5 w-5 text-gray-500 dark:text-gray-400" })}
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-base flex items-center gap-1.5">
                            {transaction.description}
                            {transaction.receiptImage && <PaperclipIcon className="h-4 w-4 text-gray-400" />}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                    </div>
                </div>
                <p className={`font-bold text-base whitespace-nowrap pl-2 ${transaction.type === TransactionType.INCOME ? 'text-secondary' : 'text-danger'}`}>
                    {transaction.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(transaction.amount)}
                </p>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(transaction.date).toLocaleDateString('vi-VN')}</p>
            </div>
        </div>
    );
};

const TransactionTableRow: React.FC<{ transaction: Transaction, onClick: (t: Transaction) => void }> = ({ transaction, onClick }) => {
    const { formatCurrency, getCategoryByName } = useFinancials();
    const category = getCategoryByName(transaction.category);
    return (
        <tr 
            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => onClick(transaction)}
            role="button"
            tabIndex={0}
            aria-label={`Xem chi tiết giao dịch ${transaction.description}`}
        >
            <td className="py-3 px-4">
               <div className="flex items-center gap-3">
                    {category && ICONS[category.icon] && (
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-full">
                            {React.cloneElement(ICONS[category.icon], { className: "h-5 w-5 text-gray-500 dark:text-gray-400" })}
                        </div>
                    )}
                    <div>
                        <span className="font-medium flex items-center gap-2">
                            {transaction.description}
                            {transaction.receiptImage && <PaperclipIcon className="h-4 w-4 text-gray-400" />}
                        </span>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</div>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4">{new Date(transaction.date).toLocaleDateString('vi-VN')}</td>
            <td className={`py-3 px-4 font-semibold ${transaction.type === TransactionType.INCOME ? 'text-secondary' : 'text-danger'}`}>
                {transaction.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(transaction.amount)}
            </td>
        </tr>
    );
};

const TransactionCalendarView: React.FC<{ transactions: Transaction[], onSelect: (t: Transaction) => void }> = ({ transactions, onSelect }) => {
    const { formatCurrency } = useFinancials();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const transactionsByDate = useMemo(() => {
        const map = new Map<string, { income: number; expense: number; list: Transaction[] }>();
        transactions.forEach(t => {
            const dateKey = new Date(t.date).toISOString().split('T')[0];
            if (!map.has(dateKey)) {
                map.set(dateKey, { income: 0, expense: 0, list: [] });
            }
            const dayData = map.get(dateKey)!;
            dayData.list.push(t);
            if (t.type === TransactionType.INCOME) {
                dayData.income += t.amount;
            } else {
                dayData.expense += t.amount;
            }
        });
        return map;
    }, [transactions]);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());
    const endDate = new Date(endOfMonth);
    if (endOfMonth.getDay() !== 6) {
        endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));
    }

    const days = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    
    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
        setSelectedDate(null);
    };
    
    const selectedDateKey = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
    const selectedDayTransactions = selectedDateKey ? transactionsByDate.get(selectedDateKey)?.list || [] : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Tháng trước">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h3 className="text-lg font-semibold">
                        {currentDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Tháng sau">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs md:text-sm text-gray-500 mb-2 font-medium">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((d, i) => {
                        const dateKey = d.toISOString().split('T')[0];
                        const dayData = transactionsByDate.get(dateKey);
                        const isToday = d.toDateString() === new Date().toDateString();
                        const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                        const isSelected = d.toDateString() === selectedDate?.toDateString();

                        return (
                            <div
                                key={i}
                                onClick={() => setSelectedDate(d)}
                                className={`p-1 md:p-2 h-20 md:h-24 flex flex-col items-center justify-start rounded-lg cursor-pointer transition-colors
                                    ${isCurrentMonth ? 'bg-light dark:bg-dark' : 'bg-gray-100 dark:bg-gray-800/50 text-gray-400'}
                                    ${isSelected ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}
                                    ${isToday && !isSelected ? 'ring-2 ring-primary' : ''}
                                `}
                            >
                                <span className={`font-medium text-sm md:text-base ${isSelected ? 'text-white' : ''}`}>{d.getDate()}</span>
                                {dayData && (
                                    <div className="text-xs mt-1 text-center overflow-hidden">
                                        {dayData.income > 0 && <p className="text-secondary truncate font-semibold">+ {formatCurrency(dayData.income)}</p>}
                                        {dayData.expense > 0 && <p className="text-danger truncate font-semibold">- {formatCurrency(dayData.expense)}</p>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            <div className="lg:col-span-1">
                 <h4 className="font-semibold mb-4 text-lg">
                    Giao dịch ngày {selectedDate ? selectedDate.toLocaleDateString('vi-VN') : '...'}
                </h4>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {selectedDayTransactions.length > 0 ? (
                        selectedDayTransactions.map(t => <TransactionCard key={t.id} transaction={t} onClick={onSelect} />)
                    ) : (
                        <Card>
                             <p className="text-center py-8 text-gray-500">Không có giao dịch nào.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};


export const Transactions: React.FC = () => {
    const { transactions, deleteTransaction, expenseCategories } = useFinancials();
    const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [scannedData, setScannedData] = useState<Partial<Omit<Transaction, 'id'>> | null>(null);
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result?.toString().split(',')[1];
            if (base64String) {
                try {
                    const result = await analyzeBillImage(base64String, file.type, expenseCategories.map(c => c.name));
                    setScannedData({
                        ...result,
                        type: TransactionType.EXPENSE,
                    });
                    setSelectedTransaction(null); // Ensure it's in "add" mode
                    setIsAddOrEditModalOpen(true);
                } catch (error) {
                    console.error("Failed to analyze image:", error);
                    alert("Không thể phân tích hình ảnh. Vui lòng thử lại.");
                } finally {
                    setIsLoading(false);
                }
            }
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handleScanClick = () => fileInputRef.current?.click();

    const handleCloseAddOrEditModal = () => {
        setIsAddOrEditModalOpen(false);
        setScannedData(null);
        setSelectedTransaction(null);
    };

    const handleOpenAddModal = () => {
        setSelectedTransaction(null);
        setScannedData(null);
        setIsAddOrEditModalOpen(true);
    };

    const handleSelectTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDetailModalOpen(true);
    };
    
    const handleEditFromDetail = (transaction: Transaction) => {
        setIsDetailModalOpen(false);
        setSelectedTransaction(transaction); // This is now the transaction to edit
        setIsAddOrEditModalOpen(true);
    };
    
    const handleDeleteFromDetail = (id: string) => {
        if(window.confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
            deleteTransaction(id);
            setIsDetailModalOpen(false);
            setSelectedTransaction(null);
        }
    };
    
    const filteredAndSortedTransactions = transactions
      .filter(transaction => 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
                disabled={isLoading}
            />
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold">Lịch sử giao dịch</h2>
                <div className="flex items-center w-full md:w-auto gap-2">
                    <div className="relative flex-grow">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div className="flex space-x-1 rounded-lg bg-gray-200 dark:bg-dark p-1 flex-shrink-0">
                        <button onClick={() => setView('list')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${view === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-300 dark:hover:bg-dark-secondary'}`} aria-label="Chế độ xem danh sách">List</button>
                        <button onClick={() => setView('calendar')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${view === 'calendar' ? 'bg-primary text-white' : 'hover:bg-gray-300 dark:hover:bg-dark-secondary'}`} aria-label="Chế độ xem lịch">Calendar</button>
                    </div>
                </div>
            </div>
             <div className="flex items-center justify-end mb-6 gap-2">
                 <button onClick={handleScanClick} className="bg-secondary text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-600 flex items-center flex-shrink-0" disabled={isLoading}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-0 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /><path fillRule="evenodd" d="M2 12.5a.5.5 0 01.5-.5h15a.5.5 0 010 1h-15a.5.5 0 01-.5-.5z" clipRule="evenodd" />
                         </svg>
                        <span className="hidden sm:inline">{isLoading ? 'Đang xử lý...' : 'Quét hóa đơn'}</span>
                    </button>
                    <button onClick={handleOpenAddModal} className="bg-primary text-white px-3 py-2 rounded-lg font-semibold hover:bg-primary-dark flex items-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-0 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="hidden sm:inline">Thêm</span>
                    </button>
             </div>
            
            {view === 'list' ? (
                <>
                    {/* Mobile View */}
                    <div className="md:hidden space-y-3">
                        {filteredAndSortedTransactions.length > 0 ? (
                            filteredAndSortedTransactions.map(t => <TransactionCard key={t.id} transaction={t} onClick={handleSelectTransaction} />)
                        ) : (
                            <Card><p className="text-center py-8 text-gray-500">{transactions.length === 0 ? "Chưa có giao dịch nào." : "Không tìm thấy giao dịch."}</p></Card>
                        )}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm">
                                        <tr>
                                            <th className="py-3 px-4 w-3/5">Mô tả</th>
                                            <th className="py-3 px-4">Ngày</th>
                                            <th className="py-3 px-4">Số tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAndSortedTransactions.length > 0 ? (
                                            filteredAndSortedTransactions.map(t => <TransactionTableRow key={t.id} transaction={t} onClick={handleSelectTransaction} />)
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="text-center py-8 text-gray-500">
                                                    {transactions.length === 0 ? "Chưa có giao dịch nào." : "Không tìm thấy giao dịch nào khớp với tìm kiếm của bạn."}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </>
            ) : (
                <TransactionCalendarView transactions={filteredAndSortedTransactions} onSelect={handleSelectTransaction} />
            )}

            <TransactionDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                transaction={selectedTransaction}
                onDelete={handleDeleteFromDetail}
                onEdit={handleEditFromDetail}
            />

            <AddTransactionModal 
                isOpen={isAddOrEditModalOpen} 
                onClose={handleCloseAddOrEditModal} 
                initialData={scannedData ?? undefined}
                transactionToEdit={selectedTransaction}
            />
        </>
    );
};