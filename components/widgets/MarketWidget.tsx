import React from 'react';
import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';

// Mock data, as we don't have a live API
const marketData = [
  { name: 'Bitcoin', symbol: 'BTC', price: 68523.45, change: 2.75, isCrypto: true },
  { name: 'Ethereum', symbol: 'ETH', price: 3567.12, change: -1.23, isCrypto: true },
  { name: 'VinFast', symbol: 'VFS', price: 4.85, change: 5.10, isCrypto: false },
  { name: 'Hòa Phát', symbol: 'HPG', price: 28300, change: -0.88, isCrypto: false },
  { name: 'S&P 500', symbol: 'SPX', price: 5478.6, change: 0.15, isCrypto: false },
];

export const MarketWidget: React.FC = () => {
    const { t } = useTranslation();
    const formatPrice = (price: number, isCrypto: boolean) => {
        if(isCrypto) {
            return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        return `${price.toLocaleString('vi-VN')} VND`;
    }

    return (
        <Card title={t('market_overview')}>
            <div className="space-y-3">
                {marketData.map(item => (
                    <div key={item.symbol} className="flex justify-between items-center text-sm">
                        <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.symbol}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">{formatPrice(item.price, item.isCrypto)}</p>
                            <p className={`text-xs font-bold ${item.change >= 0 ? 'text-secondary' : 'text-danger'}`}>
                                {item.change >= 0 ? '▲' : '▼'} {item.change.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
