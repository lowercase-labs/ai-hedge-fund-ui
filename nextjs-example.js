// This file provides an example of how to call the AI Hedge Fund API from a Next.js component
// You would typically place this in a components folder in your Next.js app

'use client';

import { useState, useEffect } from 'react';

// Define types for TypeScript (optional)
interface Position {
  long: number;
  short: number;
  long_cost_basis: number;
  short_cost_basis: number;
}

interface Portfolio {
  cash: number;
  margin_requirement: number;
  positions: Record<string, Position>;
}

interface HedgeFundRequest {
  tickers: string[];
  start_date: string;
  end_date: string;
  portfolio: Portfolio;
  show_reasoning: boolean;
  selected_analysts: string[];
  model_name: string;
  model_provider: string;
}

interface HedgeFundResponse {
  decisions: any;
  analyst_signals: any;
  error?: string;
}

export default function AIHedgeFundComponent() {
  const [loading, setLoading] = useState(false);
  const [tickers, setTickers] = useState('AAPL,MSFT,GOOGL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showReasoning, setShowReasoning] = useState(false);
  const [selectedAnalysts, setSelectedAnalysts] = useState<string[]>([]);
  const [modelName, setModelName] = useState('gpt-4o');
  const [result, setResult] = useState<HedgeFundResponse | null>(null);
  const [error, setError] = useState('');
  const [availableAnalysts, setAvailableAnalysts] = useState<{name: string, value: string}[]>([]);
  const [availableModels, setAvailableModels] = useState<{display: string, value: string}[]>([]);

  // Set default dates when component mounts
  useEffect(() => {
    const today = new Date();
    const endDateStr = today.toISOString().split('T')[0];
    
    // Set default start date to 3 months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const startDateStr = threeMonthsAgo.toISOString().split('T')[0];
    
    setStartDate(startDateStr);
    setEndDate(endDateStr);
    
    // Fetch available analysts and models
    fetchAnalysts();
    fetchModels();
  }, []);

  const fetchAnalysts = async () => {
    try {
      const response = await fetch('http://localhost:8000/analysts');
      const data = await response.json();
      setAvailableAnalysts(data.analysts);
      
      // Select all analysts by default
      setSelectedAnalysts(data.analysts.map(a => a.value));
    } catch (err) {
      console.error('Error fetching analysts:', err);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:8000/models');
      const data = await response.json();
      setAvailableModels(data.models);
    } catch (err) {
      console.error('Error fetching models:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const tickerList = tickers.split(',').map(t => t.trim());
    
    try {
      // Prepare the request payload
      const request: HedgeFundRequest = {
        tickers: tickerList,
        start_date: startDate,
        end_date: endDate,
        portfolio: {
          cash: 100000.0,
          margin_requirement: 0.0,
          positions: tickerList.reduce((acc, ticker) => {
            acc[ticker] = {
              long: 0,
              short: 0,
              long_cost_basis: 0.0,
              short_cost_basis: 0.0
            };
            return acc;
          }, {})
        },
        show_reasoning: showReasoning,
        selected_analysts: selectedAnalysts,
        model_name: modelName,
        model_provider: 'OpenAI' // You might want to make this selectable too
      };

      // Call the API
      const response = await fetch('http://localhost:8000/hedge-fund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Unknown error occurred');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to get hedge fund analysis');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Hedge Fund Analysis</h1>
      
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block mb-1">Stock Tickers (comma-separated):</label>
          <input
            type="text"
            value={tickers}
            onChange={(e) => setTickers(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block mb-1">Show Reasoning:</label>
          <input
            type="checkbox"
            checked={showReasoning}
            onChange={(e) => setShowReasoning(e.target.checked)}
            className="mr-2"
          />
        </div>
        
        <div>
          <label className="block mb-1">Select AI Analysts:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableAnalysts.map((analyst) => (
              <div key={analyst.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`analyst-${analyst.value}`}
                  value={analyst.value}
                  checked={selectedAnalysts.includes(analyst.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAnalysts([...selectedAnalysts, analyst.value]);
                    } else {
                      setSelectedAnalysts(selectedAnalysts.filter(a => a !== analyst.value));
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={`analyst-${analyst.value}`}>{analyst.name}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block mb-1">Select LLM Model:</label>
          <select
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {availableModels.map((model) => (
              <option key={model.value} value={model.value}>
                {model.display}
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </form>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {result && (
        <div className="p-4 border rounded">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          
          {/* Decisions section */}
          {result.decisions && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Trading Decisions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Ticker</th>
                      <th className="py-2 px-4 border">Decision</th>
                      <th className="py-2 px-4 border">Share Count</th>
                      <th className="py-2 px-4 border">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.decisions.trades || {}).map(([ticker, trade], index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">{ticker}</td>
                        <td className="py-2 px-4 border">{trade.action}</td>
                        <td className="py-2 px-4 border">{trade.shares}</td>
                        <td className="py-2 px-4 border">${parseFloat(trade.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Analyst Signals section */}
          {result.analyst_signals && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Analyst Signals</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Ticker</th>
                      <th className="py-2 px-4 border">Analyst</th>
                      <th className="py-2 px-4 border">Signal</th>
                      <th className="py-2 px-4 border">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.analyst_signals).map(([ticker, signals]) => 
                      Object.entries(signals).map(([analyst, data], index) => (
                        <tr key={`${ticker}-${analyst}`} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border">{ticker}</td>
                          <td className="py-2 px-4 border">{analyst}</td>
                          <td className="py-2 px-4 border">{data.signal}</td>
                          <td className="py-2 px-4 border">{data.confidence ? (data.confidence * 100).toFixed(0) + '%' : 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Reasoning section */}
          {showReasoning && result.analyst_signals && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Detailed Reasoning</h3>
              <div className="space-y-4">
                {Object.entries(result.analyst_signals).map(([ticker, signals]) => 
                  Object.entries(signals).map(([analyst, data], index) => (
                    <div key={`reasoning-${ticker}-${analyst}`} className="p-3 border rounded">
                      <h4 className="font-medium">{ticker} - {analyst}</h4>
                      <div className="mt-1 whitespace-pre-wrap text-sm">
                        {typeof data.reasoning === 'string' 
                          ? data.reasoning 
                          : JSON.stringify(data.reasoning, null, 2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}