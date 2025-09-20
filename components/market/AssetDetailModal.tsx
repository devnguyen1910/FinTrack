
import React from 'react';
import { Modal } from '../ui/Modal';
import { MarketAsset } from '../../services/marketData';
import { useTranslation } from '../../hooks/useTranslation';
import { useFinancials } from '../../context/FinancialContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AssetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: MarketAsset | null;
  isCrypto: boolean;
}

const StatItem: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="flex justify-between items-baseline py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className="font-semibold">{value}</span>
    </div>
);

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ isOpen, onClose, asset, isCrypto }) => {
    const { t } = useTranslation();
    const { formatCurrency } = useFinancials();

    if (!asset) return null;

    const changeColor = asset.change24h >= 0 ? 'text-secondary' : 'text-danger';
    const lineChartColor = asset.change24h >= 0 ? '#10B981' : '#EF4444';

    const formatMarketValue = (value: number) => {
        if (value > 1e12) return `${(value / 1e12).toFixed(2)}T`;
        if (value > 1e9) return `${(value / 1e9).toFixed(2)}B`;
        if (value > 1e6) return `${(value / 1e6).toFixed(2)}M`;
        return value.toLocaleString();
    };

    const formatAssetPrice = (price: number) => {
        return isCrypto ? `$${price.toLocaleString()}` : formatCurrency(price);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('asset_details')}>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <img src={asset.image} alt={asset.name} className="w-12 h-12 rounded-full" />
                    <div>
                        <h3 className="text-2xl font-bold">{asset.name} <span className="text-lg text-gray-500 dark:text-gray-400">{asset.symbol}</span></h3>
                        <div className="flex items-baseline gap-2">
                             <p className="text-2xl font-bold">{formatAssetPrice(asset.price)}</p>
                             <p className={`font-semibold ${changeColor}`}>{asset.change24h.toFixed(2)}% (24h)</p>
                        </div>
                    </div>
                </div>

                <div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={asset.priceHistory7d} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                            <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} />
                            <YAxis domain={['dataMin', 'dataMax']} tickFormatter={(val) => formatMarketValue(val)} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
                                    borderColor: '#4F46E5', // primary color
                                    borderRadius: '0.5rem',
                                    color: '#F9FAFB', // light color
                                }}
                                formatter={(value: number) => [formatAssetPrice(value), t('price')]} 
                            />
                            <Line type="monotone" dataKey="value" stroke={lineChartColor} strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <StatItem label={t('market_cap')} value={formatMarketValue(asset.marketCap)} />
                    <StatItem label={t('volume_24h')} value={formatMarketValue(asset.volume24h)} />
                    <StatItem label={t('high_24h')} value={formatAssetPrice(asset.high24h)} />
                    <StatItem label={t('low_24h')} value={formatAssetPrice(asset.low24h)} />
                    {isCrypto && asset.circulatingSupply && <StatItem label={t('circulating_supply')} value={asset.circulatingSupply.toLocaleString()} />}
                    {isCrypto && asset.totalSupply && <StatItem label={t('total_supply')} value={asset.totalSupply.toLocaleString()} />}
                </div>
                
                {asset.about && (
                    <div>
                        <h4 className="font-semibold text-lg mb-2">{t('about')} {asset.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {asset.about}
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
};
