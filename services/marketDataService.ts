// Market Data Service
// Handles real-time market data fetching from multiple APIs

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface ForexRate {
  pair: string;
  rate: number;
  change: number;
  changePercent: number;
  timestamp: Date;
  bid: number;
  ask: number;
  high: number;
  low: number;
}

export interface CryptoCurrency {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  circulatingSupply: number;
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

export interface EconomicIndicator {
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  period: string;
  country: string;
  source: string;
}

export interface NewsArticle {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevantSymbols: string[];
}

class MarketDataService {
  private readonly ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
  private readonly FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'demo';
  private readonly COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
  private readonly FRED_API_KEY = process.env.FRED_API_KEY || 'demo';
  
  // Vietnamese stock symbols - most traded on HOSE and HNX
  private readonly VN_STOCKS = [
    'VIC', 'VHM', 'VNM', 'VCB', 'TCB', 'BID', 'CTG', 'MSN', 'GAS', 'HPG',
    'FPT', 'MWG', 'VRE', 'SAB', 'PLX', 'STB', 'MBB', 'NVL', 'KDH', 'PNJ'
  ];

  // Cache for API responses
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  private async fetchWithCache<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttlMinutes: number = 5
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();
    
    if (cached && now - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    try {
      const data = await fetcher();
      this.cache.set(key, {
        data,
        timestamp: now,
        ttl: ttlMinutes * 60 * 1000
      });
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        console.warn(`API call failed, returning cached data for ${key}:`, error);
        return cached.data;
      }
      throw error;
    }
  }

  // Vietnamese Stock Market Data
  async getVNStocks(): Promise<StockQuote[]> {
    return this.fetchWithCache('vn-stocks', async () => {
      // In production, this would call Vietnamese stock APIs like:
      // - Vietstock API
      // - SSI API
      // - VPS API
      // For now, return mock data with realistic Vietnamese stock prices
      
      const mockData: StockQuote[] = [
        {
          symbol: 'VIC',
          name: 'Vingroup JSC',
          price: 45600,
          change: -800,
          changePercent: -1.72,
          volume: 1850000,
          marketCap: 156000000000,
          high: 46800,
          low: 45200,
          open: 46400,
          previousClose: 46400
        },
        {
          symbol: 'VNM',
          name: 'Vietnam Dairy Products JSC',
          price: 82500,
          change: 1500,
          changePercent: 1.85,
          volume: 2450000,
          marketCap: 198000000000,
          high: 83000,
          low: 81800,
          open: 81000,
          previousClose: 81000
        },
        {
          symbol: 'VCB',
          name: 'Bank for Foreign Trade of Vietnam',
          price: 98200,
          change: 2100,
          changePercent: 2.18,
          volume: 1200000,
          marketCap: 287000000000,
          high: 98500,
          low: 96800,
          open: 96100,
          previousClose: 96100
        },
        {
          symbol: 'FPT',
          name: 'FPT Corporation',
          price: 89300,
          change: 1200,
          changePercent: 1.36,
          volume: 980000,
          marketCap: 125000000000,
          high: 89800,
          low: 88100,
          open: 88100,
          previousClose: 88100
        },
        {
          symbol: 'MSN',
          name: 'Masan Group Corporation',
          price: 125000,
          change: -3500,
          changePercent: -2.72,
          volume: 850000,
          marketCap: 89000000000,
          high: 128500,
          low: 124500,
          open: 128500,
          previousClose: 128500
        }
      ];

      return mockData;
    }, 1); // Cache for 1 minute for stocks
  }

  // Market Indices (VN-Index, HNX-Index, etc.)
  async getMarketIndices(): Promise<MarketIndex[]> {
    return this.fetchWithCache('market-indices', async () => {
      return [
        {
          name: 'VN-Index',
          symbol: 'VNINDEX',
          value: 1285.67,
          change: 15.42,
          changePercent: 1.21,
          high: 1290.5,
          low: 1275.3,
          volume: 650000000
        },
        {
          name: 'HNX-Index',
          symbol: 'HNX',
          value: 245.89,
          change: -2.34,
          changePercent: -0.94,
          high: 248.2,
          low: 244.1,
          volume: 85000000
        },
        {
          name: 'UPCOM-Index',
          symbol: 'UPCOM',
          value: 92.15,
          change: 0.85,
          changePercent: 0.93,
          high: 92.8,
          low: 91.2,
          volume: 25000000
        }
      ];
    }, 2);
  }

  // Forex Rates
  async getForexRates(): Promise<ForexRate[]> {
    return this.fetchWithCache('forex-rates', async () => {
      try {
        // In production, use real forex API like Alpha Vantage or Fixer.io
        const response = await fetch(
          `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=USD&to_symbol=VND&interval=1min&apikey=${this.ALPHA_VANTAGE_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Forex API call failed');
        }

        // For demo purposes, return mock data
        return [
          {
            pair: 'USD/VND',
            rate: 24350,
            change: 25,
            changePercent: 0.10,
            timestamp: new Date(),
            bid: 24345,
            ask: 24355,
            high: 24380,
            low: 24320
          },
          {
            pair: 'EUR/VND',
            rate: 26480,
            change: -45,
            changePercent: -0.17,
            timestamp: new Date(),
            bid: 26475,
            ask: 26485,
            high: 26520,
            low: 26450
          },
          {
            pair: 'JPY/VND',
            rate: 163.5,
            change: 1.2,
            changePercent: 0.74,
            timestamp: new Date(),
            bid: 163.2,
            ask: 163.8,
            high: 164.1,
            low: 162.8
          },
          {
            pair: 'GBP/VND',
            rate: 30125,
            change: 85,
            changePercent: 0.28,
            timestamp: new Date(),
            bid: 30120,
            ask: 30130,
            high: 30180,
            low: 30050
          }
        ];
      } catch (error) {
        console.error('Failed to fetch forex data:', error);
        throw error;
      }
    }, 5);
  }

  // Cryptocurrency Data
  async getCryptocurrencies(): Promise<CryptoCurrency[]> {
    return this.fetchWithCache('crypto-data', async () => {
      try {
        const response = await fetch(
          `${this.COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
        );

        if (!response.ok) {
          throw new Error('CoinGecko API call failed');
        }

        const data = await response.json();
        
        return data.map((coin: any): CryptoCurrency => ({
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price,
          change24h: coin.price_change_24h || 0,
          changePercent24h: coin.price_change_percentage_24h || 0,
          marketCap: coin.market_cap || 0,
          volume24h: coin.total_volume || 0,
          high24h: coin.high_24h || coin.current_price,
          low24h: coin.low_24h || coin.current_price,
          circulatingSupply: coin.circulating_supply || 0
        }));
      } catch (error) {
        console.error('Failed to fetch crypto data:', error);
        // Return mock data as fallback
        return [
          {
            symbol: 'BTC',
            name: 'Bitcoin',
            price: 43250,
            change24h: 850,
            changePercent24h: 2.01,
            marketCap: 848000000000,
            volume24h: 15200000000,
            high24h: 44100,
            low24h: 42800,
            circulatingSupply: 19500000
          },
          {
            symbol: 'ETH',
            name: 'Ethereum',
            price: 2680,
            change24h: -125,
            changePercent24h: -4.46,
            marketCap: 322000000000,
            volume24h: 8500000000,
            high24h: 2820,
            low24h: 2650,
            circulatingSupply: 120280000
          },
          {
            symbol: 'BNB',
            name: 'Binance Coin',
            price: 315,
            change24h: 12,
            changePercent24h: 3.96,
            marketCap: 47000000000,
            volume24h: 1200000000,
            high24h: 320,
            low24h: 308,
            circulatingSupply: 153856150
          }
        ];
      }
    }, 3);
  }

  // Economic Indicators
  async getEconomicIndicators(): Promise<EconomicIndicator[]> {
    return this.fetchWithCache('economic-indicators', async () => {
      // In production, this would fetch from:
      // - Federal Reserve Economic Data (FRED)
      // - World Bank API
      // - IMF API
      // - Vietnamese General Statistics Office API
      
      return [
        {
          name: 'GDP Growth Rate',
          value: 6.8,
          unit: '%',
          change: 0.2,
          changePercent: 3.03,
          period: 'Q3 2024',
          country: 'Vietnam',
          source: 'GSO Vietnam'
        },
        {
          name: 'Inflation Rate (CPI)',
          value: 3.2,
          unit: '%',
          change: -0.1,
          changePercent: -3.03,
          period: 'November 2024',
          country: 'Vietnam',
          source: 'GSO Vietnam'
        },
        {
          name: 'Unemployment Rate',
          value: 2.1,
          unit: '%',
          change: -0.05,
          changePercent: -2.33,
          period: 'November 2024',
          country: 'Vietnam',
          source: 'GSO Vietnam'
        },
        {
          name: 'Interest Rate',
          value: 4.5,
          unit: '%',
          change: 0,
          changePercent: 0,
          period: 'December 2024',
          country: 'Vietnam',
          source: 'State Bank of Vietnam'
        },
        {
          name: 'Trade Balance',
          value: 24.8,
          unit: 'B USD',
          change: 2.3,
          changePercent: 10.22,
          period: 'November 2024',
          country: 'Vietnam',
          source: 'GSO Vietnam'
        },
        {
          name: 'Foreign Reserves',
          value: 108.5,
          unit: 'B USD',
          change: 1.2,
          changePercent: 1.12,
          period: 'November 2024',
          country: 'Vietnam',
          source: 'State Bank of Vietnam'
        }
      ];
    }, 60); // Cache for 1 hour for economic data
  }

  // Market News
  async getMarketNews(limit: number = 10): Promise<NewsArticle[]> {
    return this.fetchWithCache(`market-news-${limit}`, async () => {
      try {
        // In production, use news APIs like:
        // - Alpha Vantage News
        // - Finnhub News
        // - NewsAPI
        // - Vietnamese financial news sources
        
        return [
          {
            title: 'VN-Index tăng mạnh trong phiên chiều, vượt mức 1,285 điểm',
            summary: 'Thị trường chứng khoán Việt Nam kết thúc tuần giao dịch với sắc xanh tích cực. VN-Index tăng 15.42 điểm (+1.21%) lên 1,285.67 điểm.',
            url: 'https://example.com/news/1',
            source: 'VnExpress',
            publishedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            sentiment: 'positive',
            relevantSymbols: ['VIC', 'VNM', 'VCB']
          },
          {
            title: 'Fed giữ nguyên lãi suất, USD/VND ổn định quanh 24,350',
            summary: 'Quyết định giữ nguyên lãi suất của Fed giúp đồng Việt Nam ổn định. Tỷ giá USD/VND dao động trong biên độ hẹp.',
            url: 'https://example.com/news/2',
            source: 'CafeF',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            sentiment: 'neutral',
            relevantSymbols: []
          },
          {
            title: 'Bitcoin vượt 43,000 USD, thị trường crypto hồi phục',
            summary: 'Bitcoin tăng hơn 2% trong 24h qua, dẫn dắt đợt hồi phục của thị trường tiền điện tử.',
            url: 'https://example.com/news/3',
            source: 'CoinDesk Vietnam',
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            sentiment: 'positive',
            relevantSymbols: []
          }
        ];
      } catch (error) {
        console.error('Failed to fetch market news:', error);
        return [];
      }
    }, 10);
  }

  // Real-time price for specific symbol
  async getRealTimePrice(symbol: string): Promise<number> {
    return this.fetchWithCache(`price-${symbol}`, async () => {
      // Mock real-time price with slight variation
      const basePrice = symbol === 'VIC' ? 45600 : 
                       symbol === 'VNM' ? 82500 :
                       symbol === 'VCB' ? 98200 : 100000;
      
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      return Math.round(basePrice * (1 + variation));
    }, 0.5); // Cache for 30 seconds for real-time data
  }

  // Historical data for charts
  async getHistoricalData(symbol: string, period: '1D' | '1W' | '1M' | '3M' | '1Y'): Promise<Array<{
    timestamp: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>> {
    return this.fetchWithCache(`historical-${symbol}-${period}`, async () => {
      // Generate mock historical data
      const days = period === '1D' ? 1 : 
                   period === '1W' ? 7 :
                   period === '1M' ? 30 :
                   period === '3M' ? 90 : 365;
      
      const data = [];
      const basePrice = 100000;
      let currentPrice = basePrice;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const change = (Math.random() - 0.5) * 0.05; // ±2.5% daily change
        const open = currentPrice;
        const close = open * (1 + change);
        const high = Math.max(open, close) * (1 + Math.random() * 0.02);
        const low = Math.min(open, close) * (1 - Math.random() * 0.02);
        const volume = Math.floor(Math.random() * 1000000) + 500000;
        
        data.push({
          timestamp: date,
          open: Math.round(open),
          high: Math.round(high),
          low: Math.round(low),
          close: Math.round(close),
          volume
        });
        
        currentPrice = close;
      }
      
      return data;
    }, 30); // Cache for 30 minutes
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService();