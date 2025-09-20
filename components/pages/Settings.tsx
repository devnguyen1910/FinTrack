import React from 'react';
import { Card } from '../ui/Card';
import { useFinancials } from '../../context/FinancialContext';
import { TransactionType, Category, CategoryName, Transaction, Currency, Loan, Debt } from '../../types';
import { FinancialCalendar } from '../ui/FinancialCalendar';
import { Modal } from '../ui/Modal';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { ICONS, iconList } from '../ui/Icons';


const DELETION_DISABLED_CATEGORIES = ['Khác'];

const CurrencySettings: React.FC = () => {
    const { currency, setCurrency } = useFinancials();

    return (
        <Card title="Cài đặt Tiền tệ" className="lg:col-span-2">
            <div>
                <label htmlFor="currency-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Đơn vị tiền tệ chính
                </label>
                <select
                    id="currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                >
                    <option value="VND">Việt Nam Đồng (VND)</option>
                    <option value="USD">Đô la Mỹ (USD)</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Tất cả các giá trị trong ứng dụng sẽ được hiển thị bằng đơn vị tiền tệ này.
                </p>
            </div>
        </Card>
    );
};

const CategoryManager: React.FC<{
  title: string;
  categories: Category[];
  type: TransactionType;
}> = ({ title, categories, type }) => {
  const { addCategory, updateCategory, deleteCategory, transactions, budgets, recurringTransactions } = useFinancials();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [deletingCategoryName, setDeletingCategoryName] = React.useState<CategoryName | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentCategory, setCurrentCategory] = React.useState<Category | null>(null);
  
  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState('default');


  const openAddModal = () => {
    setIsEditing(false);
    setName('');
    setIcon('default');
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setName(category.name);
    setIcon(category.icon);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (name.trim() === '') {
      alert('Tên danh mục không được để trống.');
      return;
    }
    const nameExists = categories.some(c => c.name.toLowerCase() === name.trim().toLowerCase() && c.name !== currentCategory?.name);
    if (nameExists) {
      alert('Tên danh mục này đã tồn tại.');
      return;
    }

    const newCategory: Category = { name: name.trim(), icon };

    if (isEditing && currentCategory) {
      updateCategory(currentCategory.name, newCategory, type);
    } else {
      addCategory(newCategory, type);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (categoryName: CategoryName) => {
    if (DELETION_DISABLED_CATEGORIES.includes(categoryName)) {
      alert(`Không thể xóa danh mục mặc định "${categoryName}".`);
      return;
    }
    
    const isUsedInTransaction = transactions.some(t => t.category === categoryName);
    const isUsedInRecurring = recurringTransactions.some(t => t.category === categoryName);
    const isUsedInBudget = type === TransactionType.EXPENSE && budgets.some(b => b.category === categoryName);

    if (isUsedInTransaction || isUsedInBudget || isUsedInRecurring) {
      alert('Không thể xóa danh mục đang được sử dụng trong giao dịch, giao dịch định kỳ hoặc ngân sách.');
      return;
    }

    setDeletingCategoryName(categoryName);
    setIsConfirmOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (deletingCategoryName) {
        deleteCategory(deletingCategoryName, type);
        setDeletingCategoryName(null);
    }
  };

  return (
    <Card title={title}>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.name} className="flex items-center justify-between p-2 bg-light dark:bg-dark rounded-md">
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                    {React.cloneElement(ICONS[category.icon] || ICONS.default, { className: "h-5 w-5 text-gray-600 dark:text-gray-300" })}
                </div>
                <span>{category.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => openEditModal(category)} className="text-blue-500 hover:text-blue-700">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
              </button>
              <button onClick={() => handleDelete(category.name)} className="text-danger hover:text-red-700">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <button onClick={openAddModal} className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark font-semibold">Thêm danh mục</button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tên danh mục</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chọn biểu tượng</label>
                <div className="grid grid-cols-6 gap-2 p-2 bg-gray-100 dark:bg-dark rounded-lg max-h-48 overflow-y-auto">
                    {iconList.map(iconKey => (
                        <button key={iconKey} onClick={() => setIcon(iconKey)} className={`flex items-center justify-center p-2 rounded-md transition-colors ${icon === iconKey ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                            {React.cloneElement(ICONS[iconKey], { className: "h-6 w-6" })}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Hủy</button>
                <button type="button" onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">Lưu</button>
            </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDeleteCategory}
        title={`Xác nhận Xóa Danh mục`}
      >
        {`Bạn có chắc muốn xóa danh mục "${deletingCategoryName}" không?`}
      </ConfirmationModal>
    </Card>
  );
};

const LoanManager: React.FC = () => {
    const { loans, addLoan, deleteLoan, formatCurrency } = useFinancials();
    const [name, setName] = React.useState('');
    const [principal, setPrincipal] = React.useState('');
    const [interestRate, setInterestRate] = React.useState('');
    const [maturityDate, setMaturityDate] = React.useState('');
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
    const [deletingLoan, setDeletingLoan] = React.useState<Loan | null>(null);

    const handleAddLoan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !principal || !interestRate || !maturityDate) {
            alert('Vui lòng điền đầy đủ thông tin khoản vay.');
            return;
        }
        addLoan({
            name,
            principal: parseFloat(principal),
            interestRate: parseFloat(interestRate),
            maturityDate,
        });
        setName('');
        setPrincipal('');
        setInterestRate('');
        setMaturityDate('');
    };

    const handleMarkAsPaid = (loan: Loan) => {
        setDeletingLoan(loan);
        setIsConfirmOpen(true);
    }

    const confirmDeleteLoan = () => {
        if (deletingLoan) {
            deleteLoan(deletingLoan.id);
            setDeletingLoan(null);
        }
    };

    return (
        <Card title="Quản lý Khoản vay">
            <ul className="space-y-4 mb-4 max-h-96 overflow-y-auto pr-2">
                {loans.length === 0 && <li className="text-sm text-center text-gray-500 py-4">Chưa có khoản vay nào.</li>}
                {loans.map(loan => (
                    <li key={loan.id} className="p-4 bg-light dark:bg-dark rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <h5 className="font-bold text-lg text-gray-800 dark:text-gray-100">{loan.name}</h5>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-4">
                            <div className="flex flex-col">
                                <span className="text-gray-500 dark:text-gray-400">Số tiền gốc</span>
                                <span className="font-semibold text-base">{formatCurrency(loan.principal)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 dark:text-gray-400">Lãi suất</span>
                                <span className="font-semibold text-base">{loan.interestRate}% / năm</span>
                            </div>
                            <div className="flex flex-col col-span-2">
                                <span className="text-gray-500 dark:text-gray-400">Ngày đáo hạn</span>
                                <span className="font-semibold text-base">{new Date(loan.maturityDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleMarkAsPaid(loan)} 
                            className="w-full bg-secondary text-white px-4 py-2 rounded-md hover:bg-green-600 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                            aria-label={`Đánh dấu đã trả cho khoản vay ${loan.name}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Đánh dấu là đã trả xong
                        </button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddLoan} className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-lg text-gray-800 dark:text-white">Thêm khoản vay mới</h4>
                 <div>
                    <label htmlFor="loanName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên khoản vay</label>
                    <input id="loanName" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Vay mua xe" className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label htmlFor="loanPrincipal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số tiền gốc</label>
                        <input id="loanPrincipal" type="number" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="50,000,000" className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                    </div>
                    <div>
                        <label htmlFor="loanInterest" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lãi suất (%)</label>
                        <input id="loanInterest" type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(e.target.value)} placeholder="5.5" className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                    </div>
                </div>
                <div>
                  <label htmlFor="loanMaturity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày đáo hạn</label>
                  <input id="loanMaturity" type="date" value={maturityDate} onChange={e => setMaturityDate(e.target.value)} className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark font-semibold">Thêm khoản vay</button>
            </form>
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDeleteLoan}
                title="Xác nhận Hoàn tất Khoản vay"
            >
                {`Bạn có chắc chắn muốn đánh dấu khoản vay "${deletingLoan?.name}" là đã trả xong? Hành động này sẽ xóa khoản vay khỏi danh sách.`}
            </ConfirmationModal>
        </Card>
    );
};

const DebtManager: React.FC = () => {
    const { debts, addDebt, deleteDebt, formatCurrency } = useFinancials();
    const [name, setName] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [dueDate, setDueDate] = React.useState('');
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
    const [deletingDebt, setDeletingDebt] = React.useState<Debt | null>(null);

    const handleAddDebt = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !amount || !dueDate) {
            alert('Vui lòng điền đầy đủ thông tin khoản nợ.');
            return;
        }
        addDebt({ name, amount: parseFloat(amount), dueDate });
        setName('');
        setAmount('');
        setDueDate('');
    };

    const handleDeleteDebt = (debt: Debt) => {
        setDeletingDebt(debt);
        setIsConfirmOpen(true);
    };

    const confirmDeleteDebt = () => {
        if (deletingDebt) {
            deleteDebt(deletingDebt.id);
            setDeletingDebt(null);
        }
    };

    return (
        <Card title="Quản lý Khoản nợ">
            <ul className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                {debts.length === 0 && <li className="text-sm text-center text-gray-500 py-4">Chưa có khoản nợ nào.</li>}
                {debts.map(debt => (
                    <li key={debt.id} className="flex items-center justify-between p-3 bg-light dark:bg-dark rounded-md">
                        <div>
                            <p className="font-semibold">{debt.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {`Số tiền: ${formatCurrency(debt.amount)}`}
                            </p>
                             <p className="text-sm text-gray-500 dark:text-gray-400">
                                {`Đến hạn: ${new Date(debt.dueDate).toLocaleDateString('vi-VN')}`}
                            </p>
                        </div>
                        <button onClick={() => handleDeleteDebt(debt)} className="text-secondary hover:text-green-500 p-2" aria-label={`Đánh dấu đã trả cho khoản nợ ${debt.name}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddDebt} className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-lg text-gray-800 dark:text-white">Thêm khoản nợ mới</h4>
                <div>
                    <label htmlFor="debtName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên khoản nợ</label>
                    <input id="debtName" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Nợ thẻ tín dụng" className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="debtAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số tiền</label>
                    <input id="debtAmount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="10,000,000" className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="debtDueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày đến hạn</label>
                    <input id="debtDueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark font-semibold">Thêm khoản nợ</button>
            </form>
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDeleteDebt}
                title="Xác nhận Hoàn tất Khoản nợ"
            >
                {`Bạn có chắc chắn muốn xóa khoản nợ "${deletingDebt?.name}" không?`}
            </ConfirmationModal>
        </Card>
    );
};

const DataManager: React.FC = () => {
    const { transactions, addMultipleTransactions } = useFinancials();

    const handleExport = (format: 'csv' | 'json') => {
        let dataStr: string;
        let fileName: string;
        let mimeType: string;

        if (format === 'json') {
            dataStr = JSON.stringify(transactions, null, 2);
            fileName = 'transactions.json';
            mimeType = 'application/json';
        } else {
            const header = 'id,date,description,category,amount,type\n';
            const rows = transactions.map(t => 
                `${t.id},${t.date},"${t.description.replace(/"/g, '""')}",${t.category},${t.amount},${t.type}`
            ).join('\n');
            dataStr = "\uFEFF" + header + rows; // Add BOM for Excel compatibility with UTF-8
            fileName = 'transactions.csv';
            mimeType = 'text/csv;charset=utf-8;';
        }

        const blob = new Blob([dataStr], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const rows = text.split('\n').filter(row => row.trim() !== '');
                const header = rows.shift()?.trim().split(',');

                if (!header || header.join(',') !== 'date,description,category,amount,type') {
                     throw new Error('Định dạng header CSV không hợp lệ. Phải là: date,description,category,amount,type');
                }
                
                const newTransactions: Omit<Transaction, 'id'>[] = rows.map(row => {
                    const values = row.trim().split(',');
                    const [date, description, category, amount, type] = values;
                    if (values.length !== 5 || !date || !description || !category || !amount || !type) {
                        throw new Error(`Dòng không hợp lệ: ${row}`);
                    }
                    if (type !== TransactionType.INCOME && type !== TransactionType.EXPENSE) {
                        throw new Error(`Loại giao dịch không hợp lệ trong dòng: ${row}`);
                    }
                    return {
                        date,
                        description,
                        category,
                        amount: parseFloat(amount),
                        type: type as TransactionType,
                    };
                });
                
                if (newTransactions.length > 0) {
                    addMultipleTransactions(newTransactions);
                    alert(`Đã nhập thành công ${newTransactions.length} giao dịch!`);
                } else {
                    alert('Không tìm thấy giao dịch nào để nhập.');
                }
            } catch (error) {
                console.error("Lỗi khi nhập CSV:", error);
                alert(`Đã xảy ra lỗi khi xử lý tệp CSV. Vui lòng kiểm tra định dạng tệp. Lỗi: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                // Reset file input to allow re-uploading the same file
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    };


    return (
        <Card title="Quản lý Dữ liệu" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold mb-2">Nhập Dữ liệu</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Tải lên tệp CSV để nhập hàng loạt giao dịch. Định dạng yêu cầu: <code className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded">date,description,category,amount,type</code></p>
                    <label className="w-full text-center bg-secondary text-white px-4 py-2 rounded-md hover:bg-green-600 font-semibold cursor-pointer block">
                        <span>Chọn tệp CSV</span>
                        <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
                    </label>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Xuất Dữ liệu</h4>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Tải xuống tất cả dữ liệu giao dịch của bạn dưới dạng tệp CSV hoặc JSON.</p>
                    <div className="flex space-x-2">
                        <button onClick={() => handleExport('csv')} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-semibold">Xuất ra CSV</button>
                        <button onClick={() => handleExport('json')} className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 font-semibold">Xuất ra JSON</button>
                    </div>
                </div>
            </div>
        </Card>
    );
};


export const Settings: React.FC = () => {
  const { expenseCategories, incomeCategories } = useFinancials();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Cài đặt & Lập kế hoạch</h2>
      
      <FinancialCalendar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrencySettings />
        <CategoryManager
          title="Quản lý Danh mục Chi tiêu"
          categories={expenseCategories}
          type={TransactionType.EXPENSE}
        />
        <CategoryManager
          title="Quản lý Danh mục Thu nhập"
          categories={incomeCategories}
          type={TransactionType.INCOME}
        />
        <LoanManager />
        <DebtManager />
        <DataManager />
      </div>
    </div>
  );
};
