import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { useFinancials } from '../../context/FinancialContext';
import { TransactionType } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { ICONS } from '../ui/Icons';

const StatCard: React.FC<{ title: string; amount: number; color: string }> = ({ title, amount, color }) => {
  const { formatCurrency } = useFinancials();
  return (
    <Card>
      <h4 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h4>
      <p className={`text-3xl font-bold ${color}`}>
        {formatCurrency(amount)}
      </p>
    </Card>
  );
};

const FinancialHealthCard: React.FC = () => {
    const { transactions, budgets, debts } = useFinancials();

    const { score, status, savingsRate, debtToIncome } = useMemo(() => {
        const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
        
        const savings = totalIncome - totalExpense;
        const currentSavingsRate = totalIncome > 0 ? savings / totalIncome : 0;
        const savingsScore = Math.min(1, Math.max(0, currentSavingsRate) / 0.2) * 40;

        const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
        const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
        const budgetScore = totalBudget > 0 ? Math.max(0, (totalBudget - totalSpent) / totalBudget) * 30 : 30;

        const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
        const currentDebtToIncome = totalIncome > 0 ? totalDebt / totalIncome : 0;
        const debtScore = Math.max(0, 1 - Math.min(1, currentDebtToIncome / 0.4)) * 30;

        const finalScore = Math.round(savingsScore + budgetScore + debtScore);

        let finalStatus: { text: string; color: string; };
        if (finalScore >= 80) {
            finalStatus = { text: "Tuyệt vời", color: "text-secondary" };
        } else if (finalScore >= 50) {
            finalStatus = { text: "Khá tốt", color: "text-yellow-500" };
        } else {
            finalStatus = { text: "Cần cải thiện", color: "text-danger" };
        }

        return { score: finalScore, status: finalStatus, savingsRate: currentSavingsRate, debtToIncome: currentDebtToIncome };
    }, [transactions, budgets, debts]);

    return (
        <Card className="flex flex-col justify-between h-full">
            <div>
                <h4 className="text-gray-500 dark:text-gray-400 font-medium">Sức khỏe Tài chính</h4>
                <div className="flex items-baseline space-x-2 mt-2">
                    <p className={`text-5xl font-bold ${status.color}`}>{score}</p>
                    <span className="text-2xl font-semibold text-gray-400">/ 100</span>
                </div>
                <p className={`mt-1 font-semibold ${status.color}`}>{status.text}</p>
            </div>
            <div className="text-sm mt-4 space-y-1 text-gray-600 dark:text-gray-400">
                <p>Tỷ lệ tiết kiệm: <span className="font-bold">{(savingsRate * 100).toFixed(1)}%</span></p>
                <p>Tỷ lệ nợ/thu nhập: <span className="font-bold">{(debtToIncome * 100).toFixed(1)}%</span></p>
            </div>
        </Card>
    );
};

export const Dashboard: React.FC = () => {
  const { transactions, formatCurrency, getCategoryByName } = useFinancials();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="dark:fill-gray-300">{formatCurrency(value)}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const { totalIncome, totalExpense, balance, chartData, pieData } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const dailyData: { [key: string]: { income: number; expense: number } } = {};
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        dailyData[dateString] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
        const transactionDate = new Date(t.date);
        const dateString = transactionDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        if(dailyData[dateString]) {
            if (t.type === TransactionType.INCOME) {
                dailyData[dateString].income += t.amount;
            } else {
                dailyData[dateString].expense += t.amount;
            }
        }
    });

    const finalChartData = Object.entries(dailyData).map(([name, values]) => ({
        name,
        'Thu nhập': values.income,
        'Chi tiêu': values.expense,
    }));
    
    const expenseByCategory: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        const category = t.category;
        if (!expenseByCategory[category]) {
          expenseByCategory[category] = 0;
        }
        expenseByCategory[category]! += t.amount;
      });

    const finalPieData = Object.entries(expenseByCategory).map(([name, value]) => ({
      name,
      value: value || 0,
    })).sort((a,b) => b.value - a.value);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      chartData: finalChartData,
      pieData: finalPieData,
    };
  }, [transactions]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#19D1FF', '#FFB319'];

  const PieWithActiveIndex = Pie as any;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Bảng điều khiển</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Metrics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Tổng thu nhập" amount={totalIncome} color="text-secondary" />
            <StatCard title="Tổng chi tiêu" amount={totalExpense} color="text-danger" />
            <StatCard title="Số dư" amount={balance} color="text-primary" />
          </div>

          {/* Income vs Expense Chart */}
          <Card title="Tổng quan thu chi (7 ngày qua)">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="Thu nhập" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Chi tiêu" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Transactions */}
          <Card title="Giao dịch gần đây">
            <div className="space-y-3">
              {transactions.slice(-5).reverse().map((t) => {
                const category = getCategoryByName(t.category);
                return (
                  <div key={t.id} className="flex justify-between items-center p-3 bg-light dark:bg-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {category && ICONS[category.icon] && (
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                          {React.cloneElement(ICONS[category.icon], { className: "h-5 w-5 text-gray-600 dark:text-gray-300" })}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{t.description}</p>
                        <p className="text-sm text-gray-500">{t.category} - {new Date(t.date).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-secondary' : 'text-danger'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(t.amount)}
                    </p>
                  </div>
                );
              })}
              {transactions.length === 0 && <p className="text-center text-gray-500 py-4">Chưa có giao dịch nào.</p>}
            </div>
          </Card>
        </div>

        {/* Sidebar (Right Column) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Financial Health */}
          <FinancialHealthCard />

          {/* Expense Allocation */}
          <Card title="Phân bổ chi tiêu">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <PieWithActiveIndex
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </PieWithActiveIndex>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[350px] text-gray-500">
                Chưa có dữ liệu chi tiêu.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};