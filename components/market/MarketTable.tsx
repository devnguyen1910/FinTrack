
import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { MarketAsset } from '../../services/marketData';
import { Card } from '../ui/Card';
import { useFinancials } from '../../context/FinancialContext';
import { useTranslation } from '../../hooks/useTranslation';

interface MarketTableProps {
  data: MarketAsset[];
  onSelect: (asset: MarketAsset) => void;
  isCrypto: boolean;
}

const SparkLine: React.FC<{ data: { value: number }[]; color: string }> = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={40}>
    <LineChart data={data}>
      <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

export const MarketTable: React.FC<MarketTableProps> = ({ data, onSelect, isCrypto }) => {
    const { formatCurrency } = useFinancials();
    const { t } = useTranslation();

    const formatMarketValue = (value: number) => {
        if (value > 1e12) {
            return `${(value / 1e12).toFixed(2)}T`;
        }
        if (value > 1e9) {
            return `${(value / 1e9).toFixed(2)}B`;
        }
        if (value > 1e6) {
            return `${(value / 1e6).toFixed(2)}M`;
        }
        return value.toLocaleString();
    };


    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[768px] text-left">
                    <thead className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">{t('name')}</th>
                            <th className="p-3 text-right">{t('price')}</th>
                            <th className="p-3 text-right">{t('change_24h')}</th>
                            <th className="p-3 text-right hidden md:table-cell">{t('market_cap')}</th>
                            <th className="p-3 text-right hidden lg:table-cell">{t('volume_24h')}</th>
                            <th className="p-3 text-center hidden sm:table-cell">Last 7 Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((asset, index) => {
                            const changeColor = asset.change24h >= 0 ? 'text-secondary' : 'text-danger';
                            const sparklineColor = asset.change24h >= 0 ? '#10B981' : '#EF4444';
                            return (
                                <tr
                                    key={asset.id}
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                    onClick={() => onSelect(asset)}
                                >
                                    <td className="p-3 text-gray-500 dark:text-gray-400">{asset.rank}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <img src={asset.image} alt={asset.name} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="font-bold">{asset.name}</p>
                                                <p className="text-sm text-gray-500">{asset.symbol}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 text-right font-semibold">{isCrypto ? `$${asset.price.toLocaleString()}` : formatCurrency(asset.price)}</td>
                                    <td className={`p-3 text-right font-semibold ${changeColor}`}>{asset.change24h.toFixed(2)}%</td>
                                    <td className="p-3 text-right hidden md:table-cell">{formatMarketValue(asset.marketCap)}</td>
                                    <td className="p-3 text-right hidden lg:table-cell">{formatMarketValue(asset.volume24h)}</td>
                                    <td className="p-3 w-32 hidden sm:table-cell"><SparkLine data={asset.priceHistory7d} color={sparklineColor} /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {data.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        <p>Không tìm thấy tài sản nào.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};
