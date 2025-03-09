// Types for the AI Hedge Fund API

export interface Position {
  long: number;
  short: number;
  long_cost_basis: number;
  short_cost_basis: number;
}

export interface Portfolio {
  cash: number;
  margin_requirement: number;
  positions: Record<string, Position>;
  realized_gains?: Record<string, { long: number; short: number }>;
}

export interface HedgeFundRequest {
  tickers: string[];
  start_date?: string;
  end_date?: string;
  portfolio: Portfolio;
  show_reasoning: boolean;
  selected_analysts: string[];
  model_name: string;
  model_provider: string;
}

export interface Trade {
  action: 'BUY' | 'SELL' | 'HOLD';
  shares: number;
  price: number;
}

export interface AnalystSignal {
  signal: string | null;
  confidence: number | null;
  reasoning: string | Record<string, any> | null;
  max_position_size?: number | null;
}

export interface HedgeFundDecisions {
  portfolio_value: number;
  trades: Record<string, Trade>;
}

export interface HedgeFundResponse {
  decisions: HedgeFundDecisions | null;
  analyst_signals: Record<string, Record<string, AnalystSignal>> | null;
  ticker_signals?: Record<string, Record<string, AnalystSignal>> | null;
  error?: string;
}

export interface Analyst {
  name: string;
  value: string;
}

export interface Model {
  display: string;
  value: string;
}

export interface AnalystsResponse {
  analysts: Analyst[];
}

export interface ModelsResponse {
  models: Model[];
}