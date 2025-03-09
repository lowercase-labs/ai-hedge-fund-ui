'use client';

import React, { useState, useEffect, KeyboardEvent } from 'react';
import { format } from 'date-fns';
import { runHedgeFundAnalysis, createInitialPortfolio } from '@/lib/api';
import type { HedgeFundResponse } from '@/types/api';
import AnalystSelect from './AnalystSelect';
import ModelSelect from './ModelSelect';
import ResultsDisplay from './ResultsDisplay';

const HedgeFundForm: React.FC = () => {
  // Form state
  const [tickerInput, setTickerInput] = useState<string>('');
  const [tickerList, setTickerList] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL']);
  const [startDate, setStartDate] = useState<string>(() => {
    // Default to 3 months ago
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return format(date, 'yyyy-MM-dd');
  });
  const [endDate, setEndDate] = useState<string>(() => format(new Date(), 'yyyy-MM-dd'));
  const [showReasoning, setShowReasoning] = useState<boolean>(true);
  const [selectedAnalysts, setSelectedAnalysts] = useState<string[]>([]);
  const [modelName, setModelName] = useState<string>('');
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<HedgeFundResponse | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);

  const addTicker = (ticker: string) => {
    // Standardize to uppercase and trim whitespace
    ticker = ticker.trim().toUpperCase();
    
    // Don't add if it's empty or already exists
    if (!ticker || tickerList.includes(ticker)) return;
    
    setTickerList([...tickerList, ticker]);
    setTickerInput(''); // Clear input after adding
  };

  const removeTicker = (tickerToRemove: string) => {
    setTickerList(tickerList.filter(ticker => ticker !== tickerToRemove));
  };

  const handleTickerInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add ticker on Enter, comma, or space
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      if (tickerInput) {
        addTicker(tickerInput);
      }
    }
    // Handle backspace to remove last ticker when input is empty
    else if (e.key === 'Backspace' && !tickerInput && tickerList.length > 0) {
      removeTicker(tickerList[tickerList.length - 1]);
    }
  };

  const handleTickerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // If a comma or space is typed, add the ticker before it
    if (value.includes(',') || value.includes(' ')) {
      let delimiter = value.includes(',') ? ',' : ' ';
      const parts = value.split(delimiter);
      
      // Add all parts except the last one (which might be incomplete)
      for (let i = 0; i < parts.length - 1; i++) {
        if (parts[i].trim()) {
          addTicker(parts[i]);
        }
      }
      
      // Keep the last part (after the last delimiter) in the input
      setTickerInput(parts[parts.length - 1].trim());
    } else {
      setTickerInput(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (tickerList.length === 0) {
        throw new Error('Please enter at least one ticker');
      }
      
      // Only validate dates if both are provided
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        throw new Error('Start date cannot be after end date');
      }
      
      if (selectedAnalysts.length === 0) {
        throw new Error('Please select at least one analyst');
      }
      
      if (!modelName) {
        throw new Error('Please select a model');
      }
      
      // Add any ticker in the input field if it hasn't been added yet
      if (tickerInput.trim()) {
        addTicker(tickerInput);
      }
      
      // Create initial portfolio
      const portfolio = createInitialPortfolio(tickerList);
      
      // Run analysis
      const response = await runHedgeFundAnalysis({
        tickers: tickerList,
        start_date: startDate,
        end_date: endDate,
        portfolio,
        show_reasoning: showReasoning,
        selected_analysts: selectedAnalysts,
        model_name: modelName,
        model_provider: 'OpenAI',
      });
      
      setResults(response);
    } catch (err) {
      console.error('Error running analysis:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="perplexity-container dark:bg-gray-900">
      <div className="mb-6 text-center">
        <h1 className="perplexity-header dark:text-white">Financial Analysis & Trading Recommendations</h1>
        <p className="perplexity-subheader dark:text-gray-400">
          Powered by AI to deliver professional-grade stock analysis and trading insights
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left sidebar with form inputs */}
        <div className="lg:col-span-3 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Search container with shadow and focus effect */}
            <div className="perplexity-card dark:bg-gray-800 dark:border-gray-700">
              <div className="space-y-4">
                <div className="perplexity-input-group">
                  <label htmlFor="tickers" className="label dark:text-gray-300">Stocks to Analyze</label>
                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-2 input pl-10 py-2 min-h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      {tickerList.map(ticker => (
                        <div 
                          key={ticker} 
                          className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2.5 py-1 rounded-full text-sm font-medium shadow-sm transition-colors hover:bg-blue-200 dark:hover:bg-blue-800"
                        >
                          <span>{ticker}</span>
                          <button 
                            type="button"
                            onClick={() => removeTicker(ticker)}
                            className="ml-1.5 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 focus:outline-none rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                            aria-label={`Remove ${ticker}`}
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <input
                        id="tickerInput"
                        type="text"
                        value={tickerInput}
                        onChange={handleTickerInputChange}
                        onKeyDown={handleTickerInputKeyDown}
                        className="flex-grow min-w-[100px] bg-transparent focus:outline-none border-none p-0"
                        placeholder={tickerList.length > 0 ? "Add more..." : "Enter stock symbols (e.g., AAPL)"}
                        aria-label="Add stock symbol"
                      />
                    </div>
                    <svg className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                    Press Enter, comma, or space to add a ticker
                  </p>
                </div>
                
                {/* Advanced settings toggle */}
                <div className="mb-2">
                  <button 
                    type="button"
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className="flex items-center text-sm text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg 
                      className={`h-4 w-4 mr-1.5 transition-transform duration-200 ${showAdvancedSettings ? 'rotate-180' : ''}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {showAdvancedSettings ? 'Hide advanced settings' : 'Show advanced settings'}
                  </button>
                </div>
                
                {showAdvancedSettings && (
                  <div className="grid grid-cols-2 gap-4 mt-3 border-t pt-3 border-slate-200 dark:border-gray-700">
                    <div>
                      <label htmlFor="startDate" className="label dark:text-gray-300">Start Date</label>
                      <input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="input py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="label dark:text-gray-300">End Date</label>
                      <input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="input py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Analysis Options Card */}
            <div className="perplexity-card dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-sm font-medium text-slate-700 mb-3 dark:text-gray-300">Analysis Options</h3>
              
              <div className="space-y-4">
                {/* Show Reasoning */}
                <div className="flex items-center">
                  <input
                    id="showReasoning"
                    type="checkbox"
                    checked={showReasoning}
                    onChange={(e) => setShowReasoning(e.target.checked)}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-300 border-slate-300 rounded dark:border-gray-600"
                  />
                  <label htmlFor="showReasoning" className="ml-2 block text-sm text-slate-700 dark:text-gray-300">
                    Show detailed reasoning from analysts
                  </label>
                </div>
              </div>
            </div>
            
            {/* Analyst Selection */}
            <AnalystSelect
              selectedAnalysts={selectedAnalysts}
              onChange={setSelectedAnalysts}
            />
            
            {/* Model Selection */}
            <div className="perplexity-card dark:bg-gray-800 dark:border-gray-700">
              <ModelSelect
                selectedModel={modelName}
                onChange={setModelName}
              />
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="perplexity-button w-full py-3 flex justify-center items-center dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : 'Generate Analysis'}
            </button>
            
            {/* Error Message */}
            {error && (
              <div className="error dark:bg-red-900 dark:text-red-200 dark:border-red-800">
                {error}
              </div>
            )}
          </form>
        </div>
        
        {/* Main content area with results */}
        <div className="lg:col-span-9">
          {!results && !loading ? (
            <div className="perplexity-card h-full flex flex-col justify-center items-center py-12 dark:bg-gray-800 dark:border-gray-700">
              <svg className="w-16 h-16 text-blue-500 mb-6 opacity-50" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L1 21h22L12 2zm0 4.6L19.1 19H4.9L12 6.6z" />
              </svg>
              <h3 className="text-lg font-medium text-slate-700 mb-2 dark:text-gray-300">Ready to Analyze</h3>
              <p className="text-slate-500 text-center max-w-md dark:text-gray-400">
                Enter your stock tickers and analysis parameters to get AI-powered trading recommendations
              </p>
            </div>
          ) : (
            <ResultsDisplay
              results={results}
              loading={loading}
              showReasoning={showReasoning}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HedgeFundForm;