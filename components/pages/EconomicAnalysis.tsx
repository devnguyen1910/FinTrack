import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { ICONS } from '../ui/Icons';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart
} from 'recharts';

// Economic Indicator Types
interface EconomicIndicator {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  period: string;
  country: string;
  source: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
}

interface EconomicNews {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  impact: 'high' | 'medium' | 'low';
  category: 'monetary_policy' | 'fiscal_policy' | 'trade' | 'employment' | 'inflation' | 'growth';
}

interface CountryComparison {
  country: string;
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  interestRate: number;
}

// Mock data generators
const generateEconomicIndicators = (): EconomicIndicator[] => [
  {
    id: 'gdp_growth',
    name: 'GDP Growth Rate',
    value: 6.8,
    unit: '%',
    change: 0.2,
    changePercent: 3.03,
    period: 'Q3 2024',
    country: 'Vietnam',
    source: 'General Statistics Office',
    description: 'Quarterly growth rate of Gross Domestic Product',
    trend: 'up'
  },
  {
    id: 'cpi_inflation',
    name: 'Consumer Price Index',
    value: 3.2,
    unit: '%',
    change: -0.1,
    changePercent: -3.03,
    period: 'November 2024',
    country: 'Vietnam',
    source: 'General Statistics Office',
    description: 'Year-over-year inflation rate',
    trend: 'down'
  },
  {
    id: 'unemployment',
    name: 'Unemployment Rate',
    value: 2.1,
    unit: '%',
    change: -0.05,
    changePercent: -2.33,
    period: 'November 2024',
    country: 'Vietnam',
    source: 'Ministry of Labour',
    description: 'Percentage of labor force unemployed',
    trend: 'down'
  },
  {
    id: 'interest_rate',
    name: 'Base Interest Rate',
    value: 4.5,
    unit: '%',
    change: 0,
    changePercent: 0,
    period: 'December 2024',
    country: 'Vietnam',
    source: 'State Bank of Vietnam',
    description: 'Central bank base interest rate',
    trend: 'stable'
  },
  {
    id: 'trade_balance',
    name: 'Trade Balance',
    value: 24.8,
    unit: 'B USD',
    change: 2.3,
    changePercent: 10.22,
    period: 'November 2024',
    country: 'Vietnam',
    source: 'General Statistics Office',
    description: 'Difference between exports and imports',
    trend: 'up'
  },
  {
    id: 'foreign_reserves',
    name: 'Foreign Reserves',
    value: 108.5,
    unit: 'B USD',
    change: 1.2,
    changePercent: 1.12,
    period: 'November 2024',
    country: 'Vietnam',
    source: 'State Bank of Vietnam',
    description: 'International reserves held by central bank',
    trend: 'up'
  },
  {
    id: 'pmi',
    name: 'Manufacturing PMI',
    value: 54.7,
    unit: 'Index',
    change: 1.2,
    changePercent: 2.24,
    period: 'November 2024',
    country: 'Vietnam',
    source: 'Nikkei Vietnam',
    description: 'Purchasing Managers Index for manufacturing',
    trend: 'up'
  },
  {
    id: 'retail_sales',
    name: 'Retail Sales Growth',
    value: 8.5,
    unit: '%',
    change: 0.3,
    changePercent: 3.66,
    period: 'November 2024',
    country: 'Vietnam',
    source: 'General Statistics Office',
    description: 'Year-over-year retail sales growth',
    trend: 'up'
  }
];

const generateEconomicNews = (): EconomicNews[] => [
  {
    id: '1',
    title: 'State Bank of Vietnam holds interest rates steady at 4.5%',
    summary: 'The central bank maintains accommodative monetary policy to support economic growth while monitoring inflation pressures.',
    source: 'Reuters Vietnam',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    impact: 'high',
    category: 'monetary_policy'
  },
  {
    id: '2',
    title: 'Vietnam\'s trade surplus reaches $24.8 billion in 11 months',
    summary: 'Strong export performance, particularly in electronics and textiles, drives record trade surplus despite global economic headwinds.',
    source: 'Vietnam News',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    impact: 'high',
    category: 'trade'
  },
  {
    id: '3',
    title: 'Manufacturing PMI hits 8-month high of 54.7',
    summary: 'Production and new orders expansion indicates resilient manufacturing sector ahead of year-end.',
    source: 'Nikkei Asia',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    impact: 'medium',
    category: 'growth'
  },
  {
    id: '4',
    title: 'Inflation moderates to 3.2% in November',
    summary: 'Slower price growth provides room for continued supportive monetary policy.',
    source: 'VnExpress',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    impact: 'medium',
    category: 'inflation'
  }
];

const generateCountryComparison = (): CountryComparison[] => [
  { country: 'Vietnam', gdpGrowth: 6.8, inflation: 3.2, unemployment: 2.1, interestRate: 4.5 },
  { country: 'Thailand', gdpGrowth: 2.4, inflation: 0.8, unemployment: 1.2, interestRate: 2.5 },
  { country: 'Philippines', gdpGrowth: 5.2, inflation: 2.3, unemployment: 4.8, interestRate: 6.5 },
  { country: 'Indonesia', gdpGrowth: 4.9, inflation: 2.7, unemployment: 5.3, interestRate: 6.0 },
  { country: 'Malaysia', gdpGrowth: 3.8, inflation: 1.9, unemployment: 3.4, interestRate: 3.0 },
  { country: 'Singapore', gdpGrowth: 2.1, inflation: 2.8, unemployment: 2.0, interestRate: 3.5 }
];

const generateHistoricalData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    gdpGrowth: 5.5 + Math.random() * 2.5,
    inflation: 2 + Math.random() * 2,
    unemployment: 1.8 + Math.random() * 0.6,
    interestRate: 4.0 + Math.random() * 1
  }));
};

// Components
const IndicatorCard: React.FC<{ indicator: EconomicIndicator }> = ({ indicator }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <div className="text-green-600">{ICONS.trending_up}</div>;
      case 'down': return <div className="text-red-600">{ICONS.trending_down}</div>;
      case 'stable': return <div className="text-gray-600">{ICONS.minus}</div>;
      default: return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-lg">{indicator.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{indicator.period}</p>
        </div>
        {getTrendIcon(indicator.trend)}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold">{indicator.value}</span>
          <span className="text-lg text-gray-500">{indicator.unit}</span>
        </div>
        
        <div className={`flex items-center space-x-2 ${getTrendColor(indicator.trend)}`}>
          <span className="font-medium">
            {indicator.change >= 0 ? '+' : ''}{indicator.change}{indicator.unit}
          </span>
          <span className="text-sm">
            ({indicator.changePercent >= 0 ? '+' : ''}{indicator.changePercent.toFixed(2)}%)
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          {indicator.description}
        </p>
        
        <div className="text-xs text-gray-500 pt-2 border-t">
          <span>Nguồn: {indicator.source}</span>
        </div>
      </div>
    </Card>
  );
};

const NewsCard: React.FC<{ news: EconomicNews }> = ({ news }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'monetary_policy': return ICONS.bank;
      case 'fiscal_policy': return ICONS.dollar;
      case 'trade': return ICONS.globe;
      case 'employment': return ICONS.users;
      case 'inflation': return ICONS.trending_up;
      case 'growth': return ICONS.chart;
      default: return ICONS.news;
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            {getCategoryIcon(news.category)}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(news.impact)}`}>
            {news.impact.toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {news.publishedAt.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>

      <h4 className="font-bold text-lg mb-2 line-clamp-2">{news.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
        {news.summary}
      </p>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Nguồn: {news.source}</span>
        <button className="text-primary hover:underline">
          Đọc thêm
        </button>
      </div>
    </div>
  );
};

export const EconomicAnalysis: React.FC = () => {
  const { t } = useTranslation();
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
  const [news, setNews] = useState<EconomicNews[]>([]);
  const [countryData, setCountryData] = useState<CountryComparison[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'indicators' | 'comparison' | 'trends' | 'news'>('indicators');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIndicators(generateEconomicIndicators());
      setNews(generateEconomicNews());
      setCountryData(generateCountryComparison());
      setHistoricalData(generateHistoricalData());
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Phân tích kinh tế</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'indicators', label: 'Chỉ số kinh tế', icon: ICONS.analytics },
    { key: 'comparison', label: 'So sánh quốc gia', icon: ICONS.globe },
    { key: 'trends', label: 'Xu hướng', icon: ICONS.trending_up },
    { key: 'news', label: 'Tin tức', icon: ICONS.news },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Phân tích kinh tế</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Cập nhật mỗi 5 phút</span>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {indicators.slice(0, 4).map((indicator) => (
          <div key={indicator.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-sm">{indicator.name}</h4>
              <div className={`${indicator.trend === 'up' ? 'text-green-600' : indicator.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {indicator.trend === 'up' ? ICONS.trending_up : indicator.trend === 'down' ? ICONS.trending_down : ICONS.minus}
              </div>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold">{indicator.value}</span>
              <span className="text-sm text-gray-500">{indicator.unit}</span>
            </div>
            <div className={`text-sm ${indicator.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {indicator.change >= 0 ? '+' : ''}{indicator.change}{indicator.unit}
            </div>
          </div>
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
        {activeTab === 'indicators' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicators.map((indicator) => (
              <IndicatorCard key={indicator.id} indicator={indicator} />
            ))}
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <Card title="So sánh các nước ASEAN">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={countryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="gdpGrowth" fill="#3B82F6" name="GDP Growth %" />
                  <Bar dataKey="inflation" fill="#EF4444" name="Inflation %" />
                  <Bar dataKey="unemployment" fill="#F59E0B" name="Unemployment %" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Tỷ lệ lạm phát">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={countryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`${value}%`, 'Lạm phát']} />
                    <Bar dataKey="inflation" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Lãi suất cơ bản">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={countryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`${value}%`, 'Lãi suất']} />
                    <Bar dataKey="interestRate" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <Card title="Xu hướng chỉ số kinh tế (2024)">
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="gdpGrowth" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                    stroke="#3B82F6"
                    name="GDP Growth %"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="inflation" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Inflation %"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="unemployment" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Unemployment %"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="interestRate" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Interest Rate %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Tăng trưởng GDP theo quý">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={historicalData.slice(-4)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'GDP Growth']} />
                    <Area 
                      type="monotone" 
                      dataKey="gdpGrowth" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card title="Chỉ số giá tiêu dùng">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'CPI']} />
                    <Line 
                      type="monotone" 
                      dataKey="inflation" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {news.map((article) => (
              <NewsCard key={article.id} news={article} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p>
          📊 Dữ liệu từ: Tổng cục Thống kê, Ngân hàng Nhà nước, World Bank, IMF • 
          Cập nhật: {new Date().toLocaleString('vi-VN')} • 
          Chỉ mang tính chất tham khảo
        </p>
      </div>
    </div>
  );
};