import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useFinancials } from '../../context/FinancialContext';
import { getForecast, ForecastResult } from '../../services/geminiService';
import { Loading } from '../ui/Loading';
import { Error } from '../ui/Error';

const StatCard: React.FC<{ title: string; amount: number; color: string }> = ({ title, amount, color }) => {
  const { formatCurrency } = useFinancials();
  return (
    <Card className="flex-1 text-center">
      <h4 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h4>
      <p className={`text-3xl font-bold ${color}`}>
        {formatCurrency(amount)}
      </p>
    </Card>
  );
};

export const Forecast: React.FC = () => {
    const { transactions } = useFinancials();
    const [forecast, setForecast] = useState<ForecastResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateForecast = async () => {
        if (transactions.length < 10) {
            setError("Cần có ít nhất 10 giao dịch để tạo dự báo chính xác.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setForecast(null);
        try {
            const result = await getForecast(transactions);
            setForecast(result);
        } catch (err) {
            setError("Đã xảy ra lỗi khi tạo dự báo. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dự báo Dòng tiền (30 ngày tới)</h2>
            <Card>
                <div className="text-center">
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                        Sử dụng trí tuệ nhân tạo để phân tích lịch sử giao dịch và dự báo tình hình tài chính của bạn trong 30 ngày tiếp theo.
                    </p>
                    <button
                        onClick={handleGenerateForecast}
                        disabled={isLoading}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Đang phân tích...' : 'Tạo dự báo'}
                    </button>
                </div>
            </Card>

            {isLoading && <Loading text="AI đang phân tích dữ liệu của bạn..." />}

            {error && <Error message={error} onRetry={handleGenerateForecast} />}

            {forecast && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="Thu nhập dự kiến" amount={forecast.predictedIncome} color="text-secondary" />
                        <StatCard title="Chi tiêu dự kiến" amount={forecast.predictedExpenses} color="text-danger" />
                        <StatCard title="Tiết kiệm ròng" amount={forecast.predictedSavings} color="text-primary" />
                    </div>
                    <Card title="Phân tích từ AI">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{forecast.analysis}</p>
                    </Card>
                </div>
            )}
        </div>
    );
};