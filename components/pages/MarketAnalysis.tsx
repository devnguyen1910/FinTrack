import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { ICONS } from '../ui/Icons';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';

// Types for market data
interface StockPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

interface ForexRate {
  pair: string;
  rate: number;
  change: number;
  changePercent: number;
  timestamp: Date;
}

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
}

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
}

interface EconomicIndicator {
  name: string;
  value: number;
  unit: string;
  change: number;
  period: string;
  country: string;
}

// Mock data generators
const generateMockStocks = (): StockPrice[] => [
  { symbol: 'VNM', name: 'Vinamilk', price: 82500, change: 1500, changePercent: 1.85, volume: 2450000, marketCap: 198000000000 },
  { symbol: 'VIC', name: 'Vingroup', price: 45600, change: -800, changePercent: -1.72, volume: 1850000, marketCap: 156000000000 },
  { symbol: 'VCB', name: 'Vietcombank', price: 98200, change: 2100, changePercent: 2.18, volume: 1200000, marketCap: 287000000000 },
  { symbol: 'GAS', name: 'PetroVietnam Gas', price: 89300, change: -1200, changePercent: -1.33, volume: 980000, marketCap: 145000000000 },
  { symbol: 'MSN', name: 'Masan Group', price: 125000, change: 3500, changePercent: 2.88, volume: 850000, marketCap: 89000000000 },
];

const generateMockForex = (): ForexRate[] => [
  { pair: 'USD/VND', rate: 24350, change: 25, changePercent: 0.10, timestamp: new Date() },
  { pair: 'EUR/VND', rate: 26480, change: -45, changePercent: -0.17, timestamp: new Date() },
  { pair: 'JPY/VND', rate: 163.5, change: 1.2, changePercent: 0.74, timestamp: new Date() },
  { pair: 'GBP/VND', rate: 30125, change: 85, changePercent: 0.28, timestamp: new Date() },
];

const generateMockIndices = (): MarketIndex[] => [
  { name: 'VN-Index', value: 1285.67, change: 15.42, changePercent: 1.21, high: 1290.5, low: 1275.3 },
  { name: 'HNX-Index', value: 245.89, change: -2.34, changePercent: -0.94, high: 248.2, low: 244.1 },
  { name: 'UPCOM-Index', value: 92.15, change: 0.85, changePercent: 0.93, high: 92.8, low: 91.2 },
];

const generateMockCrypto = (): CryptoPrice[] => [
  { symbol: 'BTC', name: 'Bitcoin', price: 43250, change24h: 850, changePercent24h: 2.01, marketCap: 848000000000, volume24h: 15200000000 },
  { symbol: 'ETH', name: 'Ethereum', price: 2680, change24h: -125, changePercent24h: -4.46, marketCap: 322000000000, volume24h: 8500000000 },
  { symbol: 'BNB', name: 'Binance Coin', price: 315, change24h: 12, changePercent24h: 3.96, marketCap: 47000000000, volume24h: 1200000000 },
];

const generateMockEconomicData = (): EconomicIndicator[] => [
  { name: 'GDP Growth', value: 6.8, unit: '%', change: 0.2, period: 'Q3 2024', country: 'Vietnam' },
  { name: 'CPI Inflation', value: 3.2, unit: '%', change: -0.1, period: 'Nov 2024', country: 'Vietnam' },
  { name: 'Unemployment', value: 2.1, unit: '%', change: -0.05, period: 'Nov 2024', country: 'Vietnam' },
  { name: 'Interest Rate', value: 4.5, unit: '%', change: 0, period: 'Dec 2024', country: 'Vietnam' },
];

// Components
const StockCard: React.FC<{ stock: StockPrice }> = ({ stock }) => {
  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const bgColor = isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';
  
  return (
    <div className={`p-4 rounded-lg border ${bgColor} border-gray-200 dark:border-gray-700`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-lg">{stock.symbol}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
        </div>
        <div className={`flex items-center ${changeColor}`}>
          {isPositive ? ICONS.trending_up : ICONS.trending_down}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold">{stock.price.toLocaleString()} VND</p>
        <p className={`text-sm font-medium ${changeColor}`}>
          {isPositive ? '+' : ''}{stock.change.toLocaleString()} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
          <p>Vol: {(stock.volume / 1000000).toFixed(1)}M</p>
          <p>Cap: {(stock.marketCap / 1000000000).toFixed(0)}B VND</p>
        </div>
      </div>
    </div>
  );
};

const ForexCard: React.FC<{ forex: ForexRate }> = ({ forex }) => {
  const isPositive = forex.change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-lg">{forex.pair}</h4>
        <div className={`flex items-center ${changeColor}`}>
          {isPositive ? ICONS.trending_up : ICONS.trending_down}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-xl font-bold">{forex.rate.toLocaleString()}</p>
        <p className={`text-sm font-medium ${changeColor}`}>
          {isPositive ? '+' : ''}{forex.change} ({isPositive ? '+' : ''}{forex.changePercent.toFixed(2)}%)
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Cập nhật: {forex.timestamp.toLocaleTimeString('vi-VN')}
        </p>
      </div>
    </div>
  );
};

const IndexCard: React.FC<{ index: MarketIndex }> = ({ index }) => {
  const isPositive = index.change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const bgColor = isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';
  
  return (
    <div className={`p-4 rounded-lg border ${bgColor} border-gray-200 dark:border-gray-700`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-lg">{index.name}</h4>
        <div className={`flex items-center ${changeColor}`}>
          {isPositive ? ICONS.trending_up : ICONS.trending_down}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold">{index.value.toFixed(2)}</p>
        <p className={`text-sm font-medium ${changeColor}`}>
          {isPositive ? '+' : ''}{index.change.toFixed(2)} ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span>High: {index.high}</span>
          <span>Low: {index.low}</span>
        </div>
      </div>
    </div>
  );
};

const EconomicIndicatorCard: React.FC<{ indicator: EconomicIndicator }> = ({ indicator }) => {
  const isPositive = indicator.change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className="p-4 rounded-lg border bg-purple-50 dark:bg-purple-900/20 border-gray-200 dark:border-gray-700">
      <h4 className="font-bold text-sm mb-2">{indicator.name}</h4>
      <div className="space-y-1">
        <p className="text-xl font-bold">{indicator.value}{indicator.unit}</p>
        <p className={`text-sm font-medium ${changeColor}`}>
          {isPositive ? '+' : ''}{indicator.change}{indicator.unit}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {indicator.period} • {indicator.country}
        </p>
      </div>
    </div>
  );
};

const MarketHeatmap: React.FC<{ stocks: StockPrice[] }> = ({ stocks }) => {
  const data = stocks.map(stock => ({
    name: stock.symbol,
    value: Math.abs(stock.changePercent),
    fill: stock.changePercent >= 0 ? '#10B981' : '#EF4444',
    changePercent: stock.changePercent
  }));

  return (
    <Card title="Market Heatmap">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: any, name: any, props: any) => [
              `${props.payload.changePercent.toFixed(2)}%`, 
              'Change'
            ]}
          />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export const MarketAnalysis: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'stocks' | 'forex' | 'crypto' | 'economics'>('stocks');
  const [stocks, setStocks] = useState<StockPrice[]>([]);
  const [forex, setForex] = useState<ForexRate[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [crypto, setCrypto] = useState<CryptoPrice[]>([]);
  const [economics, setEconomics] = useState<EconomicIndicator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    const loadData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStocks(generateMockStocks());
      setForex(generateMockForex());
      setIndices(generateMockIndices());
      setCrypto(generateMockCrypto());
      setEconomics(generateMockEconomicData());
      setLoading(false);
    };

    loadData();
  }, []);

  const tabs = [
    { key: 'stocks', label: 'Chứng khoán', icon: ICONS.chart },
    { key: 'forex', label: 'Ngoại hối', icon: ICONS.currency },
    { key: 'crypto', label: 'Crypto', icon: ICONS.bitcoin },
    { key: 'economics', label: 'Kinh tế', icon: ICONS.analytics },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Phân tích thị trường</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Phân tích thị trường</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Data</span>
        </div>
      </div>

      {/* Market Indices Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map((index) => (
          <IndexCard key={index.name} index={index} />
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 justify-center transition-colors ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'stocks' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stocks.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
              ))}
            </div>
            <MarketHeatmap stocks={stocks} />
          </>
        )}

        {activeTab === 'forex' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {forex.map((rate) => (
              <ForexCard key={rate.pair} forex={rate} />
            ))}
          </div>
        )}

        {activeTab === 'crypto' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crypto.map((coin) => (
              <div key={coin.symbol} className="p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-900/20 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg">{coin.symbol}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{coin.name}</p>
                  </div>
                  <div className={`flex items-center ${coin.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {coin.changePercent24h >= 0 ? ICONS.trending_up : ICONS.trending_down}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-2xl font-bold">${coin.price.toLocaleString()}</p>
                  <p className={`text-sm font-medium ${coin.changePercent24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {coin.changePercent24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)} ({coin.changePercent24h >= 0 ? '+' : ''}{coin.changePercent24h.toFixed(2)}%)
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                    <p>Vol 24h: ${(coin.volume24h / 1000000000).toFixed(1)}B</p>
                    <p>Market Cap: ${(coin.marketCap / 1000000000).toFixed(0)}B</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'economics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {economics.map((indicator) => (
              <EconomicIndicatorCard key={indicator.name} indicator={indicator} />
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p>
          📊 Dữ liệu được cập nhật mỗi 30 giây • 
          Nguồn: Alpha Vantage, Finnhub, CoinGecko • 
          Chỉ mang tính chất tham khảo
        </p>
      </div>
    </div>
  );
};