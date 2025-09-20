import { TransactionType, TransactionPriority, Transaction, Budget, Goal, RecurringTransaction, Loan, Debt } from './types';

// A sample 1x1 red pixel GIF for receipt image placeholder
const sampleReceiptImage = 'data:image/gif;base64,R0lGODlhAQABAPAAAP8AACwAAAAAAQABAAACAkQBADs=';

const generateYearData = () => {
    const transactions: Omit<Transaction, 'id'>[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Generate data for the last 12 months
    for (let i = 12; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const month = date.getMonth();
        const year = date.getFullYear();

        // --- INCOME ---
        transactions.push({ type: TransactionType.INCOME, category: 'Lương', amount: 45000000, description: `Lương tháng ${month + 1}`, date: new Date(year, month, 5).toISOString().split('T')[0] });
        if (month % 3 === 0) {
            transactions.push({ type: TransactionType.INCOME, category: 'Thưởng', amount: 5000000, description: `Thưởng quý`, date: new Date(year, month, 6).toISOString().split('T')[0] });
        }
         if (month === 1) { // Tet bonus
            transactions.push({ type: TransactionType.INCOME, category: 'Thưởng', amount: 25000000, description: `Thưởng Tết`, date: new Date(year, month, 2).toISOString().split('T')[0] });
        }

        // --- CORE EXPENSES ---
        transactions.push({ type: TransactionType.EXPENSE, category: 'Nhà ở', amount: 12000000, description: 'Tiền thuê nhà', date: new Date(year, month, 2).toISOString().split('T')[0], priority: 'High' });
        transactions.push({ type: TransactionType.EXPENSE, category: 'Tiện ích', amount: 1500000 + Math.random() * 500000, description: 'Điện, nước, internet', date: new Date(year, month, 10).toISOString().split('T')[0], priority: 'High' });
        transactions.push({ type: TransactionType.EXPENSE, category: 'Hóa đơn & Dịch vụ', amount: 500000, description: 'Gói Netflix, Spotify', date: new Date(year, month, 15).toISOString().split('T')[0], priority: 'Medium' });
        transactions.push({ type: TransactionType.EXPENSE, category: 'Di chuyển', amount: 1200000 + Math.random() * 300000, description: 'Xăng xe, gửi xe', date: new Date(year, month, 25).toISOString().split('T')[0] });

        // --- VARIABLE EXPENSES ---
        // Food
        for (let j = 0; j < 10; j++) {
            transactions.push({ type: TransactionType.EXPENSE, category: 'Ăn uống', amount: 150000 + Math.random() * 200000, description: 'Đi chợ, ăn ngoài', date: new Date(year, month, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] });
        }
        // Shopping & Entertainment
        transactions.push({ type: TransactionType.EXPENSE, category: 'Mua sắm', amount: 500000 + Math.random() * 1500000, description: 'Mua sắm linh tinh', date: new Date(year, month, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0], priority: 'Low' });
        transactions.push({ type: TransactionType.EXPENSE, category: 'Giải trí', amount: 300000 + Math.random() * 700000, description: 'Xem phim, cà phê', date: new Date(year, month, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] });

        // --- SEASONAL & SPECIAL EXPENSES ---
        if (month === 1) { // Tet holiday
            transactions.push({ type: TransactionType.EXPENSE, category: 'Quà tặng & Từ thiện', amount: 10000000, description: 'Mừng tuổi gia đình', date: new Date(year, month, 3).toISOString().split('T')[0], priority: 'High' });
            transactions.push({ type: TransactionType.EXPENSE, category: 'Mua sắm', amount: 5000000, description: 'Sắm đồ Tết', date: new Date(year, month, 1).toISOString().split('T')[0] });
        }
        if (month >= 5 && month <= 7) { // Summer
            transactions.push({ type: TransactionType.EXPENSE, category: 'Du lịch', amount: 15000000, description: 'Du lịch hè Đà Nẵng', date: new Date(year, 6, 15).toISOString().split('T')[0], priority: 'Medium' });
        }
        if (month === 11) { // Year-end
             transactions.push({ type: TransactionType.EXPENSE, category: 'Mua sắm', amount: 3000000, description: 'Mua sắm Black Friday', date: new Date(year, month, 25).toISOString().split('T')[0], receiptImage: sampleReceiptImage });
        }
    }
    return transactions.map(t => ({ ...t, id: crypto.randomUUID() }));
};

const sampleTransactions: Transaction[] = generateYearData();

const sampleBudgets: Omit<Budget, 'id' | 'spent'>[] = [
    { category: 'Ăn uống', amount: 8000000 },
    { category: 'Mua sắm', amount: 4000000 },
    { category: 'Giải trí', amount: 2500000 },
    { category: 'Di chuyển', amount: 2000000 },
    { category: 'Tiện ích', amount: 2000000 },
];

const getDateFromNow = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

const sampleGoals: Omit<Goal, 'id'>[] = [
    { name: 'Mua Macbook Pro M3', targetAmount: 65000000, currentAmount: 25000000, deadline: getDateFromNow(180) },
    { name: 'Du lịch Châu Âu', targetAmount: 120000000, currentAmount: 35000000, deadline: getDateFromNow(365) },
    { name: 'Quỹ khẩn cấp', targetAmount: 100000000, currentAmount: 100000000 },
];

const sampleRecurring: Omit<RecurringTransaction, 'id'>[] = [
    { type: TransactionType.EXPENSE, category: 'Nhà ở', amount: 12000000, description: 'Tiền thuê nhà', startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0], frequency: 'monthly' },
    { type: TransactionType.EXPENSE, category: 'Hóa đơn & Dịch vụ', amount: 450000, description: 'Gói Netflix Premium', startDate: '2023-01-15', frequency: 'monthly' },
    { type: TransactionType.EXPENSE, category: 'Sức khỏe', amount: 1000000, description: 'Phí thành viên phòng gym', startDate: '2023-02-01', frequency: 'monthly' },
    { type: TransactionType.INCOME, category: 'Đầu tư', amount: 1500000, description: 'Cổ tức hàng tháng', startDate: '2023-03-20', frequency: 'monthly' },
];

const sampleLoans: Omit<Loan, 'id'>[] = [
    { name: "Vay mua xe Honda Vision", principal: 35000000, interestRate: 7.5, maturityDate: getDateFromNow(365) },
    { name: "Vay tiêu dùng FE Credit", principal: 15000000, interestRate: 12, maturityDate: getDateFromNow(150) },
];

const sampleDebts: Omit<Debt, 'id'>[] = [
    { name: "Nợ thẻ tín dụng VIB", amount: 8500000, dueDate: getDateFromNow(10) },
    { name: "Trả góp điện thoại", amount: 2000000, dueDate: getDateFromNow(25) },
];


export const seedData = () => {
    const isSeeded = localStorage.getItem('isSeeded');
    if (isSeeded === 'v2') { // Update version to re-seed if needed
        return;
    }

    localStorage.setItem('transactions', JSON.stringify(sampleTransactions));
    localStorage.setItem('budgets', JSON.stringify(sampleBudgets.map(b => ({...b, id: crypto.randomUUID(), spent: 0}))));
    localStorage.setItem('goals', JSON.stringify(sampleGoals.map(g => ({...g, id: crypto.randomUUID()}))));
    localStorage.setItem('recurringTransactions', JSON.stringify(sampleRecurring.map(r => ({...r, id: crypto.randomUUID()}))));
    localStorage.setItem('loans', JSON.stringify(sampleLoans.map(l => ({...l, id: crypto.randomUUID()}))));
    localStorage.setItem('debts', JSON.stringify(sampleDebts.map(d => ({...d, id: crypto.randomUUID()}))));

    localStorage.setItem('isSeeded', 'v2');
    console.log('Comprehensive sample data v2 has been seeded.');
};