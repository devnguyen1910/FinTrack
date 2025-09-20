
export interface MarketAsset {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  image: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  priceHistory7d: { date: string; value: number }[];
  high24h: number;
  low24h: number;
  circulatingSupply?: number;
  totalSupply?: number;
  about?: string;
}

const generatePriceHistory = (base: number, days: number): { date: string; value: number }[] => {
  const history = [];
  let currentPrice = base;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    history.push({
      date: date.toISOString().split('T')[0],
      value: currentPrice,
    });
    const change = currentPrice * (Math.random() - 0.48) * 0.1; // Fluctuate up to 10%
    currentPrice += change;
  }
  return history;
};

const createAsset = (
  id: string,
  rank: number,
  name: string,
  symbol: string,
  image: string,
  price: number,
  marketCap: number,
  volume24h: number,
  isCrypto: boolean = true,
  about: string
): MarketAsset => {
  const priceHistory = generatePriceHistory(price * (1 + (Math.random() - 0.5) * 0.2), 7);
  const change24h = ((price / priceHistory[priceHistory.length-2].value) - 1) * 100;

  return {
    id,
    rank,
    name,
    symbol,
    image,
    price,
    change24h,
    marketCap,
    volume24h,
    priceHistory7d: priceHistory,
    high24h: price * (1 + Math.random() * 0.05),
    low24h: price * (1 - Math.random() * 0.05),
    circulatingSupply: isCrypto ? marketCap / price : undefined,
    totalSupply: isCrypto ? (marketCap / price) * (1 + Math.random() * 0.2) : undefined,
    about
  };
};

export const cryptoData: MarketAsset[] = [
  createAsset('bitcoin', 1, 'Bitcoin', 'BTC', 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', 68523.45, 1350e9, 45e9, true, 'Bitcoin là một loại tiền tệ kỹ thuật số phi tập trung, không có ngân hàng trung ương hoặc quản trị viên duy nhất, có thể được gửi từ người dùng này sang người dùng khác trên mạng bitcoin ngang hàng mà không cần qua trung gian.'),
  createAsset('ethereum', 2, 'Ethereum', 'ETH', 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', 3567.12, 428e9, 22e9, true, 'Ethereum là một nền tảng blockchain phi tập trung, mã nguồn mở với chức năng hợp đồng thông minh. Ether là tiền điện tử gốc của nền tảng.'),
  createAsset('solana', 3, 'Solana', 'SOL', 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png', 165.80, 75e9, 3.5e9, true, 'Solana là một nền tảng blockchain hiệu suất cao được thiết kế để hỗ trợ các ứng dụng phi tập trung (dApps) và tiền điện tử có thể mở rộng.'),
  createAsset('binance-coin', 4, 'BNB', 'BNB', 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png', 601.50, 92e9, 2.1e9, true, 'BNB là tiền điện tử cung cấp năng lượng cho hệ sinh thái Chuỗi BNB. Đây là một trong những token tiện ích phổ biến nhất thế giới.'),
  createAsset('ripple', 5, 'XRP', 'XRP', 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png', 0.52, 28e9, 1.8e9, true, 'XRP là tài sản kỹ thuật số gốc trên Sổ kế toán XRP—một công nghệ blockchain mã nguồn mở, phi tập trung, không cần cấp phép.'),
  createAsset('dogecoin', 6, 'Dogecoin', 'DOGE', 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png', 0.16, 23e9, 1.2e9, true, 'Dogecoin là một loại tiền điện tử ngang hàng, mã nguồn mở. Nó được coi là một altcoin và là một meme coin được ra mắt một cách châm biếm.'),
];

export const stockData: MarketAsset[] = [
  createAsset('hoa-phat-group', 1, 'Tập đoàn Hòa Phát', 'HPG', 'https://s3-symbol-logo.tradingview.com/hoa-phat--600.png', 28300, 165e12, 800e9, false, 'Tập đoàn Hòa Phát là một tập đoàn công nghiệp sản xuất của Việt Nam. Công ty hoạt động trong năm lĩnh vực: Sắt thép (thép xây dựng, thép cuộn cán nóng), Sản phẩm thép (ống thép, tôn mạ, thép rút dây, thép dự ứng lực), Nông nghiệp, Bất động sản và Điện máy gia dụng.'),
  createAsset('fpt-corporation', 2, 'Tập đoàn FPT', 'FPT', 'https://s3-symbol-logo.tradingview.com/fpt--600.png', 135000, 171e12, 500e9, false, 'Công ty Cổ phần FPT là một trong những công ty dịch vụ công nghệ thông tin lớn nhất tại Việt Nam với các lĩnh vực kinh doanh chính là công nghệ, viễn thông và giáo dục.'),
  createAsset('vingroup', 3, 'Tập đoàn Vingroup', 'VIC', 'https://s3-symbol-logo.tradingview.com/vingroup--600.png', 42800, 163e12, 300e9, false, 'Vingroup là một trong những tập đoàn kinh tế tư nhân đa ngành lớn nhất châu Á, hoạt động trong ba lĩnh vực kinh doanh cốt lõi, bao gồm: Công nghệ - Công nghiệp, Thương mại Dịch vụ, Thiện nguyện Xã hội.'),
  createAsset('vinamilk', 4, 'Vinamilk', 'VNM', 'https://s3-symbol-logo.tradingview.com/vinamilk--600.png', 67500, 141e12, 250e9, false, 'Công ty Cổ phần Sữa Việt Nam là một công ty sản xuất, kinh doanh sữa và các sản phẩm từ sữa cũng như các thiết bị máy móc liên quan tại Việt Nam.'),
  createAsset('apple', 5, 'Apple Inc.', 'AAPL', 'https://s3-symbol-logo.tradingview.com/apple--600.png', 214.29 * 25400, 3.28e12 * 25400, 25e9 * 25400, false, 'Apple Inc. là một tập đoàn công nghệ đa quốc gia của Mỹ có trụ sở chính tại Cupertino, California, chuyên thiết kế, phát triển và bán thiết bị điện tử tiêu dùng, phần mềm máy tính và các dịch vụ trực tuyến.'),
  createAsset('microsoft', 6, 'Microsoft Corp.', 'MSFT', 'https://s3-symbol-logo.tradingview.com/microsoft--600.png', 447.57 * 25400, 3.32e12 * 25400, 20e9 * 25400, false, 'Microsoft Corporation là một tập đoàn công nghệ đa quốc gia của Mỹ, sản xuất phần mềm máy tính, điện tử tiêu dùng, máy tính cá nhân và các dịch vụ liên quan.'),
];
