// API service for communicating with the AI Hedge Fund backend
import axios from 'axios';
import type { 
  HedgeFundRequest, 
  HedgeFundResponse, 
  AnalystsResponse, 
  ModelsResponse,
  Portfolio
} from '@/types/api';

// Base URL for the API
const API_BASE_URL = 'http://localhost:8000';

// Create an axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Run the hedge fund analysis
 */
export const runHedgeFundAnalysis = async (requestData: HedgeFundRequest): Promise<HedgeFundResponse> => {
  try {
    console.log('Sending request to API:', requestData);
    const response = await apiClient.post<HedgeFundResponse>('/hedge-fund', requestData);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    if (axios.isAxiosError(error) && error.response) {
      // If the API returned an error response
      console.error('API Response Error:', error.response.data);
      throw new Error(error.response.data.detail || 'An error occurred while running analysis');
    }
    throw new Error('Failed to connect to the server');
  }
};

/**
 * Get the list of available analysts
 */
export const getAnalysts = async (): Promise<AnalystsResponse> => {
  try {
    const response = await apiClient.get<AnalystsResponse>('/analysts');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch analysts');
  }
};

/**
 * Get the list of available models
 */
export const getModels = async (): Promise<ModelsResponse> => {
  try {
    const response = await apiClient.get<ModelsResponse>('/models');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch models');
  }
};

/**
 * Create an initial portfolio with cash and empty positions
 */
export const createInitialPortfolio = (tickers: string[], initialCash: number = 100000): Portfolio => {
  return {
    cash: initialCash,
    margin_requirement: 0,
    positions: tickers.reduce((acc, ticker) => {
      acc[ticker] = {
        long: 0,
        short: 0,
        long_cost_basis: 0,
        short_cost_basis: 0
      };
      return acc;
    }, {} as Record<string, { long: number, short: number, long_cost_basis: number, short_cost_basis: number }>)
  };
};