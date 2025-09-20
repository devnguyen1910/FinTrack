import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useFinancials } from '../../context/FinancialContext';
import { TransactionType, Budget, ReportData } from '../../types';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

type ReportType = 'expense' | 'income' | 'budget' | 'expense-allocation';

const ReportControls: React.FC<{
  reportType: ReportType;
  setReportType: (type: ReportType) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onGenerate: () => void;
}> = ({ reportType, setReportType, startDate, setStartDate, endDate, setEndDate, onGenerate }) => (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="md:col-span-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại báo cáo</label>
          <div className="flex space-x-2 rounded-lg bg-gray-200 dark:bg-dark p-1">
            <button onClick={() => setReportType('expense')} className={`w-full p-2 text-sm font-semibold rounded-md transition ${reportType === 'expense' ? 'bg-primary text-white' : 'hover:bg-gray-300 dark:hover:bg-dark-secondary'}`}>Chi tiêu</button>
            <button onClick={() => setReportType('income')} className={`w-full p-2 text-sm font-semibold rounded-md transition ${reportType === 'income' ? 'bg-primary text-white' : 'hover:bg-gray-300 dark:hover:bg-dark-secondary'}`}>Thu nhập</button>
            <button onClick={() => setReportType('budget')} className={`w-full p-2 text-sm font-semibold rounded-md transition ${reportType === 'budget' ? 'bg-primary text-white' : 'hover:bg-gray-300 dark:hover:bg-dark-secondary'}`}>Ngân sách</button>
            <button onClick={() => setReportType('expense-allocation')} className={`w-full p-2 text-sm font-semibold rounded-md transition ${reportType === 'expense-allocation' ? 'bg-primary text-white' : 'hover:bg-gray-300 dark:hover:bg-dark-secondary'}`}>Phân bổ</button>
          </div>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Từ ngày</label>
          <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Đến ngày</label>
          <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        <div className="md:col-span-1">
           <button onClick={onGenerate} className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark flex items-center justify-center">
              Tạo báo cáo
           </button>
        </div>
      </div>
    </Card>
);

const TrendReport: React.FC<{ data: ReportData, type: 'income' | 'expense' }> = ({ data, type }) => {
    const { formatCurrency } = useFinancials();
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#19D1FF', '#FFB319'];
    const title = type === 'income' ? 'Thu nhập' : 'Chi tiêu';
    const color = type === 'income' ? 'text-secondary' : 'text-danger';
    const strokeColor = type === 'income' ? '#10B981' : '#EF4444';

    return (
        <div className="space-y-6 mt-6">
            <Card>
                <h3 className="text-lg font-semibold">Tổng {title.toLowerCase()}</h3>
                <p className={`text-3xl font-bold ${color}`}>{formatCurrency(data.total)}</p>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2" title={`Phân bổ ${title.toLowerCase()}`}>
                    {data.byCategory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={data.byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                    {data.byCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-center text-gray-500 h-full flex items-center justify-center">Không có dữ liệu.</p>}
                </Card>
                <Card className="lg:col-span-3" title={`Xu hướng ${title.toLowerCase()}`}>
                    {data.trend.length > 0 ? (
                         <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.trend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)"/>
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Line type="monotone" dataKey="amount" name={title} stroke={strokeColor} strokeWidth={2}/>
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <p className="text-center text-gray-500 h-full flex items-center justify-center">Không có dữ liệu.</p>}
                </Card>
            </div>
        </div>
    );
};

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
            {percentage > 100 && (
                 <div className="bg-danger h-2.5 rounded-full" style={{ width: `100%` }}></div>
            )}
        </div>
    );
};


const BudgetReport: React.FC<{ data: ReportData }> = ({ data }) => {
    const { formatCurrency } = useFinancials();
    if (!data.budgetComparison || data.budgetComparison.length === 0) {
        return <Card className="mt-6"><p className="text-center text-gray-500 p-8">Không có ngân sách nào được thiết lập cho việc so sánh.</p></Card>;
    }
    const totalBudgeted = data.budgetComparison.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = data.budgetComparison.reduce((sum, b) => sum + b.spent, 0);

    return (
        <div className="space-y-6 mt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h4 className="text-gray-500 dark:text-gray-400 font-medium">Tổng ngân sách</h4>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(totalBudgeted)}</p>
                </Card>
                <Card>
                    <h4 className="text-gray-500 dark:text-gray-400 font-medium">Tổng đã chi</h4>
                    <p className={`text-3xl font-bold ${totalSpent > totalBudgeted ? 'text-danger' : 'text-secondary'}`}>{formatCurrency(totalSpent)}</p>
                </Card>
             </div>
             <Card title="Chi tiết ngân sách">
                <div className="space-y-4">
                    {data.budgetComparison.map(b => {
                         const remaining = b.amount - b.spent;
                         return (
                            <div key={b.id} className="p-4 rounded-lg bg-light dark:bg-dark">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">{b.category}</span>
                                    <span className={`font-semibold text-sm px-2 py-1 rounded-full ${b.status === 'overspent' ? 'bg-danger/20 text-danger' : 'bg-secondary/20 text-secondary'}`}>
                                        {b.status === 'overspent' ? 'Vượt mức' : 'Trong hạn mức'}
                                    </span>
                                </div>
                                <ProgressBar value={b.spent} max={b.amount} />
                                <div className="flex justify-between text-sm mt-2 text-gray-600 dark:text-gray-400">
                                    <span>Đã chi: {formatCurrency(b.spent)}</span>
                                    <span>/ {formatCurrency(b.amount)}</span>
                                </div>
                                <p className={`mt-1 text-sm font-semibold ${remaining < 0 ? 'text-danger' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {remaining >= 0 ? `Còn lại: ${formatCurrency(remaining)}` : `Vượt: ${formatCurrency(Math.abs(remaining))}`}
                                </p>
                            </div>
                         );
                    })}
                </div>
             </Card>
        </div>
    );
};

const ExpenseAllocationReport: React.FC<{ data: ReportData }> = ({ data }) => {
    const { formatCurrency } = useFinancials();
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];

    return (
        <div className="space-y-6 mt-6">
             <Card>
                <h3 className="text-lg font-semibold">Tổng chi tiêu trong kỳ</h3>
                <p className="text-3xl font-bold text-danger">{formatCurrency(data.total)}</p>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-2" title="Phân bổ chi tiêu trong kỳ">
                    {data.byCategory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={data.byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                    return (
                                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-bold text-sm">
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}>
                                    {data.byCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-center text-gray-500 h-full flex items-center justify-center">Không có dữ liệu chi tiêu.</p>}
                </Card>
                <Card className="lg:col-span-3" title="So sánh chi tiêu hàng tháng">
                     {data.monthlyComparison && data.monthlyComparison.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.monthlyComparison}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                {data.comparisonMonths?.map((month, index) => (
                                    <Bar key={month} dataKey={month} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="text-center text-gray-500 h-full flex items-center justify-center">Không đủ dữ liệu để so sánh.</p>}
                </Card>
            </div>
        </div>
    );
};


export const Reports: React.FC = () => {
    const [reportType, setReportType] = useState<ReportType>('expense');
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(1); // First day of current month
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [generatedReport, setGeneratedReport] = useState<ReportData | null>(null);

    const { transactions, budgets } = useFinancials();

    const handleGenerateReport = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include entire end day

        const filteredTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= start && tDate <= end;
        });

        let data: ReportData = { total: 0, byCategory: [], trend: [] };

        if (reportType === 'expense' || reportType === 'income') {
            const typeToFilter = reportType === 'expense' ? TransactionType.EXPENSE : TransactionType.INCOME;
            const relevantTransactions = filteredTransactions.filter(t => t.type === typeToFilter);

            data.total = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);

            const byCategoryMap = new Map<string, number>();
            relevantTransactions.forEach(t => {
                byCategoryMap.set(t.category, (byCategoryMap.get(t.category) || 0) + t.amount);
            });
            data.byCategory = Array.from(byCategoryMap.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

            const trendMap = new Map<string, number>();
            relevantTransactions.forEach(t => {
                const dateStr = new Date(t.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                trendMap.set(dateStr, (trendMap.get(dateStr) || 0) + t.amount);
            });
            data.trend = Array.from(trendMap.entries())
                .map(([date, amount]) => ({ date, amount }))
                .sort((a, b) => {
                    const dateA = new Date(a.date.split('/').reverse().join('-') + '-2000'); // Add dummy year for sorting
                    const dateB = new Date(b.date.split('/').reverse().join('-') + '-2000');
                    return dateA.getTime() - dateB.getTime();
                });
        } else if (reportType === 'budget') {
            const expenseTransactions = filteredTransactions.filter(t => t.type === TransactionType.EXPENSE);
            const spentByCategory = new Map<string, number>();
            expenseTransactions.forEach(t => {
                spentByCategory.set(t.category, (spentByCategory.get(t.category) || 0) + t.amount);
            });

            data.budgetComparison = budgets.map(b => {
                const spent = spentByCategory.get(b.category) || 0;
                return { ...b, spent, status: spent > b.amount ? 'overspent' : 'on-track' };
            });
        } else if (reportType === 'expense-allocation') {
            const expenseTransactions = filteredTransactions.filter(t => t.type === TransactionType.EXPENSE);
            data.total = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

            const byCategoryMap = new Map<string, number>();
            expenseTransactions.forEach(t => {
                byCategoryMap.set(t.category, (byCategoryMap.get(t.category) || 0) + t.amount);
            });
            data.byCategory = Array.from(byCategoryMap.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

            // Month-over-month comparison logic
            const monthlyData: { [month: string]: { [category: string]: number } } = {};
            const comparisonMonths: string[] = [];
            const allCategoriesInPeriod = new Set<string>();

            for (let i = 2; i >= 0; i--) {
                const monthDate = new Date(end);
                monthDate.setDate(1);
                monthDate.setMonth(monthDate.getMonth() - i);
                
                const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
                const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
                monthEnd.setHours(23, 59, 59, 999);

                const monthName = monthDate.toLocaleString('vi-VN', { month: 'short' });
                comparisonMonths.push(monthName);
                monthlyData[monthName] = {};

                transactions
                    .filter(t => {
                        const tDate = new Date(t.date);
                        return t.type === TransactionType.EXPENSE && tDate >= monthStart && tDate <= monthEnd;
                    })
                    .forEach(t => {
                        monthlyData[monthName][t.category] = (monthlyData[monthName][t.category] || 0) + t.amount;
                        allCategoriesInPeriod.add(t.category);
                    });
            }
            
            const totalSpendingByCategory = new Map<string, number>();
            allCategoriesInPeriod.forEach(cat => {
                const total = comparisonMonths.reduce((sum, month) => sum + (monthlyData[month][cat] || 0), 0);
                totalSpendingByCategory.set(cat, total);
            });

            const topCategories = Array.from(totalSpendingByCategory.entries())
                .sort((a,b) => b[1] - a[1])
                .slice(0, 5) // Top 5 categories
                .map(entry => entry[0]);

            data.monthlyComparison = topCategories.map(category => {
                const row: { [key: string]: string | number } = { name: category };
                comparisonMonths.forEach(month => {
                    row[month] = monthlyData[month][category] || 0;
                });
                return row;
            });
            data.comparisonMonths = comparisonMonths;
        }
        setGeneratedReport(data);
    };

    const renderReport = () => {
        if (!generatedReport) {
            return (
                <Card className="mt-6">
                    <p className="text-center p-8 text-gray-500">
                        Vui lòng chọn loại báo cáo và khoảng thời gian, sau đó nhấn "Tạo báo cáo" để xem phân tích.
                    </p>
                </Card>
            );
        }

        switch (reportType) {
            case 'expense':
            case 'income':
                return <TrendReport data={generatedReport} type={reportType} />;
            case 'budget':
                return <BudgetReport data={generatedReport} />;
            case 'expense-allocation':
                return <ExpenseAllocationReport data={generatedReport} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Báo cáo tài chính</h2>
            <ReportControls
                reportType={reportType} setReportType={setReportType}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                onGenerate={handleGenerateReport}
            />
            {renderReport()}
        </div>
    );
};