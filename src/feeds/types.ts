export interface PriceUpdate {
  symbol: string;
  price: number;
  source: string;
  timestamp: number;
}

export interface FeedHealth {
  connected: boolean;
  lastMessageAt: number | null;
  reconnectCount: number;
}
