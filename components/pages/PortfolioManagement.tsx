import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { useTranslation } from '../../hooks/useTranslation';
import { useFinancials } from '../../context/FinancialContext';
import { ICONS } from '../ui/Icons';
import { 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

// Portfolio Types
export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'bond' | 'crypto' | 'mutual_fund' | 'etf' | 'real_estate';
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  sector?: string;
  country?: string;
  currency: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  holdings: PortfolioHolding[];
  createdAt: Date;
  updatedAt: Date;
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

export interface PortfolioPerformance {
  date: Date;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

// Mock data generators
const generateMockPortfolios = (): Portfolio[] => {
  const holdings1: PortfolioHolding[] = [
    {
      id: '1',
      symbol: 'VIC',
      name: 'Vingroup JSC',
      type: 'stock',
      quantity: 1000,
      averagePrice: 44000,
      currentPrice: 45600,
      purchaseDate: new Date('2024-01-15'),
      sector: 'Real Estate',
      country: 'Vietnam',
      currency: 'VND'
    },
    {
      id: '2',
      symbol: 'VNM',
      name: 'Vinamilk',
      type: 'stock',
      quantity: 500,
      averagePrice: 78000,
      currentPrice: 82500,
      purchaseDate: new Date('2024-02-10'),
      sector: 'Consumer Goods',
      country: 'Vietnam',
      currency: 'VND'
    },
    {
      id: '3',
      symbol: 'BTC',
      name: 'Bitcoin',
      type: 'crypto',
      quantity: 0.5,
      averagePrice: 40000,
      currentPrice: 43250,
      purchaseDate: new Date('2024-03-05'),
      currency: 'USD'
    }
  ];

  const portfolio1: Portfolio = {
    id: 'p1',
    name: 'Danh mục chính',
    description: 'Danh mục đầu tư dài hạn',
    holdings: holdings1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    totalValue: 0,
    totalCost: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0
  };

  // Calculate portfolio metrics
  let totalValue = 0;
  let totalCost = 0;
  
  holdings1.forEach(holding => {
    const holdingValue = holding.quantity * holding.currentPrice;
    const holdingCost = holding.quantity * holding.averagePrice;
    totalValue += holdingValue;
    totalCost += holdingCost;
  });

  portfolio1.totalValue = totalValue;
  portfolio1.totalCost = totalCost;
  portfolio1.totalGainLoss = totalValue - totalCost;
  portfolio1.totalGainLossPercent = ((totalValue - totalCost) / totalCost) * 100;

  return [portfolio1];
};

const generatePerformanceData = (): PortfolioPerformance[] => {
  const data: PortfolioPerformance[] = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6); // 6 months ago
  
  let currentValue = 100000000; // 100M VND
  
  for (let i = 0; i < 180; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Simulate portfolio growth with some volatility
    const dailyChange = (Math.random() - 0.48) * 0.03; // Slight upward bias
    currentValue *= (1 + dailyChange);
    
    const initialValue = 100000000;
    const gainLoss = currentValue - initialValue;
    const gainLossPercent = (gainLoss / initialValue) * 100;
    
    data.push({
      date,
      value: Math.round(currentValue),
      gainLoss: Math.round(gainLoss),
      gainLossPercent: Number(gainLossPercent.toFixed(2))
    });
  }
  
  return data;
};

// Components
const HoldingCard: React.FC<{ 
  holding: PortfolioHolding; 
  onEdit: (holding: PortfolioHolding) => void;
  onDelete: (holdingId: string) => void;
}> = ({ holding, onEdit, onDelete }) => {
  const currentValue = holding.quantity * holding.currentPrice;
  const cost = holding.quantity * holding.averagePrice;
  const gainLoss = currentValue - cost;
  const gainLossPercent = (gainLoss / cost) * 100;
  const isPositive = gainLoss >= 0;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stock': return ICONS.chart;
      case 'crypto': return ICONS.bitcoin;
      case 'bond': return ICONS.shield;
      case 'mutual_fund': return ICONS.pie_chart;
      case 'etf': return ICONS.trending_up;
      case 'real_estate': return ICONS.home;
      default: return ICONS.circle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stock': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'crypto': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'bond': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'mutual_fund': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'etf': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'real_estate': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(holding.type)}`}>
            {getTypeIcon(holding.type)}
          </div>
          <div>
            <h4 className="font-bold text-lg">{holding.symbol}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{holding.name}</p>
            {holding.sector && (
              <p className="text-xs text-gray-500">{holding.sector}</p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(holding)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {ICONS.edit}
          </button>
          <button
            onClick={() => onDelete(holding.id)}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600"
          >
            {ICONS.trash}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Số lượng</p>
          <p className="font-medium">{holding.quantity.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Giá hiện tại</p>
          <p className="font-medium">{holding.currentPrice.toLocaleString()} {holding.currency}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Giá mua TB</p>
          <p className="font-medium">{holding.averagePrice.toLocaleString()} {holding.currency}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Giá trị hiện tại</p>
          <p className="font-medium">{currentValue.toLocaleString()} {holding.currency}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Lãi/Lỗ</span>
          <div className={`text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <p className="font-bold">
              {isPositive ? '+' : ''}{gainLoss.toLocaleString()} {holding.currency}
            </p>
            <p className="text-sm">
              ({isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddHoldingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (holding: Omit<PortfolioHolding, 'id'>) => void;
  editingHolding?: PortfolioHolding;
}> = ({ isOpen, onClose, onSave, editingHolding }) => {
  const [formData, setFormData] = useState<Omit<PortfolioHolding, 'id'>>({
    symbol: '',
    name: '',
    type: 'stock',
    quantity: 0,
    averagePrice: 0,
    currentPrice: 0,
    purchaseDate: new Date(),
    sector: '',
    country: 'Vietnam',
    currency: 'VND'
  });

  useEffect(() => {
    if (editingHolding) {
      setFormData({
        symbol: editingHolding.symbol,
        name: editingHolding.name,
        type: editingHolding.type,
        quantity: editingHolding.quantity,
        averagePrice: editingHolding.averagePrice,
        currentPrice: editingHolding.currentPrice,
        purchaseDate: editingHolding.purchaseDate,
        sector: editingHolding.sector || '',
        country: editingHolding.country || 'Vietnam',
        currency: editingHolding.currency
      });
    } else {
      setFormData({
        symbol: '',
        name: '',
        type: 'stock',
        quantity: 0,
        averagePrice: 0,
        currentPrice: 0,
        purchaseDate: new Date(),
        sector: '',
        country: 'Vietnam',
        currency: 'VND'
      });
    }
  }, [editingHolding, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingHolding ? "Chỉnh sửa tài sản" : "Thêm tài sản mới"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mã chứng khoán</label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="VIC, BTC, ..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên tài sản</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Vingroup JSC"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loại tài sản</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="stock">Cổ phiếu</option>
              <option value="crypto">Tiền điện tử</option>
              <option value="bond">Trái phiếu</option>
              <option value="mutual_fund">Quỹ đầu tư</option>
              <option value="etf">ETF</option>
              <option value="real_estate">Bất động sản</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số lượng</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              step="0.00001"
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Giá mua trung bình</label>
            <input
              type="number"
              value={formData.averagePrice}
              onChange={(e) => setFormData({...formData, averagePrice: Number(e.target.value)})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giá hiện tại</label>
            <input
              type="number"
              value={formData.currentPrice}
              onChange={(e) => setFormData({...formData, currentPrice: Number(e.target.value)})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Đồng tiền</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="VND">VND</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày mua</label>
            <input
              type="date"
              value={formData.purchaseDate.toISOString().split('T')[0]}
              onChange={(e) => setFormData({...formData, purchaseDate: new Date(e.target.value)})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ngành (tùy chọn)</label>
            <input
              type="text"
              value={formData.sector}
              onChange={(e) => setFormData({...formData, sector: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Công nghệ, Ngân hàng, ..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quốc gia</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Vietnam, USA, ..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
          >
            {editingHolding ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const PortfolioManagement: React.FC = () => {
  const { t } = useTranslation();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [performanceData, setPerformanceData] = useState<PortfolioPerformance[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [isAddHoldingModalOpen, setIsAddHoldingModalOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<PortfolioHolding | undefined>();
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'performance' | 'analysis'>('overview');

  useEffect(() => {
    const mockPortfolios = generateMockPortfolios();
    setPortfolios(mockPortfolios);
    setSelectedPortfolio(mockPortfolios[0]);
    setPerformanceData(generatePerformanceData());
  }, []);

  const handleAddHolding = (holdingData: Omit<PortfolioHolding, 'id'>) => {
    if (!selectedPortfolio) return;

    const newHolding: PortfolioHolding = {
      ...holdingData,
      id: Date.now().toString()
    };

    const updatedPortfolio = {
      ...selectedPortfolio,
      holdings: [...selectedPortfolio.holdings, newHolding],
      updatedAt: new Date()
    };

    // Recalculate portfolio metrics
    let totalValue = 0;
    let totalCost = 0;
    
    updatedPortfolio.holdings.forEach(holding => {
      totalValue += holding.quantity * holding.currentPrice;
      totalCost += holding.quantity * holding.averagePrice;
    });

    updatedPortfolio.totalValue = totalValue;
    updatedPortfolio.totalCost = totalCost;
    updatedPortfolio.totalGainLoss = totalValue - totalCost;
    updatedPortfolio.totalGainLossPercent = ((totalValue - totalCost) / totalCost) * 100;

    setSelectedPortfolio(updatedPortfolio);
    setPortfolios(prev => prev.map(p => p.id === updatedPortfolio.id ? updatedPortfolio : p));
  };

  const handleEditHolding = (holdingData: Omit<PortfolioHolding, 'id'>) => {
    if (!selectedPortfolio || !editingHolding) return;

    const updatedHolding: PortfolioHolding = {
      ...holdingData,
      id: editingHolding.id
    };

    const updatedPortfolio = {
      ...selectedPortfolio,
      holdings: selectedPortfolio.holdings.map(h => h.id === editingHolding.id ? updatedHolding : h),
      updatedAt: new Date()
    };

    // Recalculate portfolio metrics
    let totalValue = 0;
    let totalCost = 0;
    
    updatedPortfolio.holdings.forEach(holding => {
      totalValue += holding.quantity * holding.currentPrice;
      totalCost += holding.quantity * holding.averagePrice;
    });

    updatedPortfolio.totalValue = totalValue;
    updatedPortfolio.totalCost = totalCost;
    updatedPortfolio.totalGainLoss = totalValue - totalCost;
    updatedPortfolio.totalGainLossPercent = ((totalValue - totalCost) / totalCost) * 100;

    setSelectedPortfolio(updatedPortfolio);
    setPortfolios(prev => prev.map(p => p.id === updatedPortfolio.id ? updatedPortfolio : p));
    setEditingHolding(undefined);
  };

  const handleDeleteHolding = (holdingId: string) => {
    if (!selectedPortfolio) return;

    if (confirm('Bạn có chắc chắn muốn xóa tài sản này?')) {
      const updatedPortfolio = {
        ...selectedPortfolio,
        holdings: selectedPortfolio.holdings.filter(h => h.id !== holdingId),
        updatedAt: new Date()
      };

      // Recalculate portfolio metrics
      let totalValue = 0;
      let totalCost = 0;
      
      updatedPortfolio.holdings.forEach(holding => {
        totalValue += holding.quantity * holding.currentPrice;
        totalCost += holding.quantity * holding.averagePrice;
      });

      updatedPortfolio.totalValue = totalValue;
      updatedPortfolio.totalCost = totalCost;
      updatedPortfolio.totalGainLoss = totalValue - totalCost;
      updatedPortfolio.totalGainLossPercent = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

      setSelectedPortfolio(updatedPortfolio);
      setPortfolios(prev => prev.map(p => p.id === updatedPortfolio.id ? updatedPortfolio : p));
    }
  };

  if (!selectedPortfolio) {
    return <div>Loading...</div>;
  }

  // Portfolio allocation data for pie chart
  const allocationData = selectedPortfolio.holdings.map(holding => ({
    name: holding.symbol,
    value: holding.quantity * holding.currentPrice,
    percentage: ((holding.quantity * holding.currentPrice) / selectedPortfolio.totalValue) * 100
  }));

  // Asset type allocation
  const typeAllocation = selectedPortfolio.holdings.reduce((acc, holding) => {
    const value = holding.quantity * holding.currentPrice;
    const existing = acc.find(item => item.type === holding.type);
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ type: holding.type, value, name: holding.type });
    }
    return acc;
  }, [] as Array<{ type: string; value: number; name: string }>);

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316'];

  const tabs = [
    { key: 'overview', label: 'Tổng quan', icon: ICONS.chart },
    { key: 'holdings', label: 'Tài sản', icon: ICONS.wallet },
    { key: 'performance', label: 'Hiệu suất', icon: ICONS.trending_up },
    { key: 'analysis', label: 'Phân tích', icon: ICONS.analytics },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý danh mục đầu tư</h2>
        <button
          onClick={() => setIsAddHoldingModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
        >
          {ICONS.plus}
          <span>Thêm tài sản</span>
        </button>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tổng giá trị</p>
              <p className="text-2xl font-bold">{selectedPortfolio.totalValue.toLocaleString()} VND</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              {ICONS.wallet}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tổng vốn</p>
              <p className="text-2xl font-bold">{selectedPortfolio.totalCost.toLocaleString()} VND</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              {ICONS.dollar}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lãi/Lỗ</p>
              <p className={`text-2xl font-bold ${selectedPortfolio.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedPortfolio.totalGainLoss >= 0 ? '+' : ''}{selectedPortfolio.totalGainLoss.toLocaleString()} VND
              </p>
            </div>
            <div className={`p-3 rounded-lg ${selectedPortfolio.totalGainLoss >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
              {selectedPortfolio.totalGainLoss >= 0 ? ICONS.trending_up : ICONS.trending_down}
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">% Lãi/Lỗ</p>
              <p className={`text-2xl font-bold ${selectedPortfolio.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedPortfolio.totalGainLossPercent >= 0 ? '+' : ''}{selectedPortfolio.totalGainLossPercent.toFixed(2)}%
              </p>
            </div>
            <div className={`p-3 rounded-lg ${selectedPortfolio.totalGainLossPercent >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
              {ICONS.percent}
            </div>
          </div>
        </Card>
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Phân bổ theo tài sản">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${Number(value).toLocaleString()} VND`, 'Giá trị']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Phân bổ theo loại tài sản">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeAllocation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString()} VND`, 'Giá trị']} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {activeTab === 'holdings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedPortfolio.holdings.map((holding) => (
              <HoldingCard 
                key={holding.id} 
                holding={holding}
                onEdit={(holding) => {
                  setEditingHolding(holding);
                  setIsAddHoldingModalOpen(true);
                }}
                onDelete={handleDeleteHolding}
              />
            ))}
          </div>
        )}

        {activeTab === 'performance' && (
          <Card title="Hiệu suất danh mục (6 tháng qua)">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('vi-VN')}
                />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString('vi-VN')}
                  formatter={(value: any, name) => [
                    name === 'value' ? `${Number(value).toLocaleString()} VND` : `${Number(value).toFixed(2)}%`,
                    name === 'value' ? 'Giá trị' : 'Lãi/Lỗ %'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        )}

        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Top Performers">
              <div className="space-y-3">
                {selectedPortfolio.holdings
                  .sort((a, b) => {
                    const aPercent = ((a.currentPrice - a.averagePrice) / a.averagePrice) * 100;
                    const bPercent = ((b.currentPrice - b.averagePrice) / b.averagePrice) * 100;
                    return bPercent - aPercent;
                  })
                  .slice(0, 5)
                  .map((holding) => {
                    const gainLossPercent = ((holding.currentPrice - holding.averagePrice) / holding.averagePrice) * 100;
                    return (
                      <div key={holding.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium">{holding.symbol}</p>
                          <p className="text-sm text-gray-500">{holding.name}</p>
                        </div>
                        <div className={`text-right ${gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          <p className="font-bold">{gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Card>

            <Card title="Phân tích rủi ro">
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Cảnh báo tập trung</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Danh mục có thể tập trung quá nhiều vào một số tài sản. Hãy xem xét đa dạng hóa.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">📊 Phân tích kỹ thuật</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Beta danh mục: 1.2 (cao hơn thị trường)<br/>
                    Sharpe Ratio: 0.85 (khá tốt)<br/>
                    Độ biến động: 18.5% (trung bình)
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Add/Edit Holding Modal */}
      <AddHoldingModal
        isOpen={isAddHoldingModalOpen}
        onClose={() => {
          setIsAddHoldingModalOpen(false);
          setEditingHolding(undefined);
        }}
        onSave={editingHolding ? handleEditHolding : handleAddHolding}
        editingHolding={editingHolding}
      />
    </div>
  );
};