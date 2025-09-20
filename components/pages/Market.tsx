
import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { cryptoData, stockData, MarketAsset } from '../../services/marketData';
import { MarketTable } from '../market/MarketTable';
import { AssetDetailModal } from '../market/AssetDetailModal';

type MarketType = 'crypto' | 'stocks';

export const Market: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<MarketType>('crypto');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);

    const handleSelectAsset = (asset: MarketAsset) => {
        setSelectedAsset(asset);
    };

    const handleCloseModal = () => {
        setSelectedAsset(null);
    };
    
    const data = useMemo(() => {
        const sourceData = activeTab === 'crypto' ? cryptoData : stockData;
        if (!searchTerm) {
            return sourceData;
        }
        return sourceData.filter(asset => 
            asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeTab, searchTerm]);

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('market')}</h2>
                <Card>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex space-x-1 rounded-lg bg-gray-200 dark:bg-dark p-1 self-start md:self-center">
                            <button onClick={() => setActiveTab('crypto')} className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === 'crypto' ? 'bg-primary text-white' : 'hover:bg-gray-300 dark:hover:bg-dark-secondary'}`}>{t('crypto_market')}</button>
                            <button onClick={() => setActiveTab('stocks')} className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === 'stocks' ? 'bg-primary text-white' : 'hover:bg-gray-300 dark:hover:bg-dark-secondary'}`}>{t('stock_market')}</button>
                        </div>
                        <div className="relative w-full md:w-auto">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder={t('search_asset')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full md:w-64 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                </Card>

                <MarketTable data={data} onSelect={handleSelectAsset} isCrypto={activeTab === 'crypto'} />
            </div>

            <AssetDetailModal
                isOpen={!!selectedAsset}
                onClose={handleCloseModal}
                asset={selectedAsset}
                isCrypto={activeTab === 'crypto'}
            />
        </>
    );
};
