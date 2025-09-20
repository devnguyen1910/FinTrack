
import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { useFinancials } from '../../context/FinancialContext';
import { TransactionType } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { ICONS } from '../ui/Icons';
import { useTranslation } from '../../hooks/useTranslation';

const StatCard: React.FC<{ title: string; amount: number; color: string; icon: JSX.Element }> = ({ title, amount, color, icon }) => {
  const { formatCurrency } = useFinancials();
  return (
    <Card className="flex items-center gap-4">
      <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')}/20`}>
        {React.cloneElement(icon, { className: `h-6 w-6 ${color}` })}
      </div>
      <div>
        <h4 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h4>
        <p className={`text-2xl font-bold ${color}`}>
          {formatCurrency(amount)}
        </p>
      </div>
    </Card>
  );
};

const FinancialHealthCard: React.FC<{ score: number; status: { text: string; color: string; } }> = ({ score, status }) => {
    const { t } = useTranslation();
    const data = [{ name: 'Score', value: score }];

    return (
        <Card className="flex flex-col items-center justify-center text-center h-full">
            <h4 className="text-gray-500 dark:text-gray-400 font-medium mb-2">{t('financial_health')}</h4>
            <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="90%"
                        barSize={15}
                        data={data}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={10}
                            className={status.color.replace('text-', 'fill-')}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className={`text-4xl font-bold ${status.color}`}>{score}</p>
                    <span className="text-lg font-semibold text-gray-400">/ 100</span>
                </div>
            </div>
             <p className={`mt-2 font-semibold ${status.color}`}>{status.text}</p>
        </Card>
    );
};


export const Dashboard: React.FC = () => {
  const { transactions, formatCurrency, getCategoryByName, budgets, debts } = useFinancials();
  const { t } = useTranslation();
  
  const { totalIncome, totalExpense, balance, chartData, pieData, healthScore, healthStatus } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    // Health Score Calculation
    const savings = income - expense;
    const currentSavingsRate = income > 0 ? savings / income : 0;
    const savingsScore = Math.min(1, Math.max(0, currentSavingsRate) / 0.2) * 40;
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const budgetScore = totalBudget > 0 ? Math.max(0, (totalBudget - totalSpent) / totalBudget) * 30 : 30;
    const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
    const currentDebtToIncome = income > 0 ? totalDebt / income : 0;
    const debtScore = Math.max(0, 1 - Math.min(1, currentDebtToIncome / 0.4)) * 30;
    const finalScore = Math.round(savingsScore + budgetScore + debtScore);

    let finalStatus: { text: string; color: string; };
    if (finalScore >= 80) {
        finalStatus = { text: t('health_excellent'), color: "text-secondary" };
    } else if (finalScore >= 50) {
        finalStatus = { text: t('health_good'), color: "text-yellow-500" };
    } else {
        finalStatus = { text: t('health_improvement'), color: "text-danger" };
    }

    // Chart Data
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
    const finalChartData = Object.entries(dailyData).map(([name, values]) => ({ name, [t('income')]: values.income, [t('expense')]: values.expense }));
    
    const expenseByCategory: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });
    const finalPieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value: value || 0 })).sort((a,b) => b.value - a.value);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      chartData: finalChartData,
      pieData: finalPieData,
      healthScore: finalScore,
      healthStatus: finalStatus,
    };
  }, [transactions, budgets, debts, t]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#19D1FF', '#FFB319'];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('dashboard')}</h2>
      
      {/* Top Row: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 lg:col-span-1">
             <FinancialHealthCard score={healthScore} status={healthStatus} />
        </div>
        <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
             <StatCard title={t('total_income')} amount={totalIncome} color="text-secondary" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM5.28 4.22a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM14.72 4.22a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zM15.25 9.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM5.28 13.22a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM14.72 13.22a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06z" /></svg>} />
            <StatCard title={t('total_expense')} amount={totalExpense} color="text-danger" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM5.28 4.22a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM14.72 4.22a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zM15.25 9.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM5.28 13.22a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM14.72 13.22a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06z" /></svg>} />
            <StatCard title={t('balance')} amount={balance} color="text-primary" icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 0v9.5c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-9.5a.75.75 0 00-.75-.75H3.25a.75.75 0 00-.75.75z" clipRule="evenodd" /></svg>} />
        </div>
      </div>

      {/* Second Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card title={t('income_expense_overview_7_days')} className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey={t('income')} fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey={t('expense')} fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title={t('expense_allocation')} className="lg:col-span-2">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                {/* FIX: The 'percent' prop can be undefined. Add a fallback to 0 to prevent type errors during arithmetic operations. */}
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" paddingAngle={3} label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-gray-500">{t('no_expense_data')}</div>
          )}
        </Card>
      </div>

      {/* Third Row: Recent Transactions */}
      <Card title={t('recent_transactions')}>
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
          {transactions.length === 0 && <p className="text-center text-gray-500 py-4">{t('no_transactions_yet')}</p>}
        </div>
      </Card>
    </div>
  );
};
