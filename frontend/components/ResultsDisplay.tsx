'use client';

import React from 'react';
import type { HedgeFundResponse } from '@/types/api';
import { analysisService } from '@/services/analysis/analysis.service';
import { auth } from '@/services/config/init';

interface ResultsDisplayProps {
  results: HedgeFundResponse | null;
  loading: boolean;
  showReasoning: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, loading, showReasoning }) => {
  // Debug log entire results object
  React.useEffect(() => {
    if (results) {
      console.log('Complete analysis results:', results);
    }
  }, [results]);

  // Add this state near where other state is defined (e.g., top of the component or inside the analyst signals section)
  const [selectedAnalyst, setSelectedAnalyst] = React.useState<{ticker: string, analyst: string, reasoning: string | null} | null>(null);

  const handleSaveAnalysis = async () => {
    try {
      // Debug authentication state
      console.log('Current auth state:', {
        isAuthenticated: !!auth.currentUser,
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email
      });

      if (!auth.currentUser) {
        throw new Error('You must be signed in to save analyses');
      }

      if (!results) {
        throw new Error('No results to save');
      }

      // Clean and validate the data before saving
      const analysisData = {
        title: 'Portfolio Analysis',
        description: 'Analysis of portfolio performance and trading decisions',
        parameters: {
          portfolio_value: results.decisions?.portfolio_value || 0,
          tickers: Object.keys(results.decisions || {}).filter(key => key !== 'portfolio_value'),
        },
        results: {
          decisions: results.decisions || {},
          analyst_signals: results.analyst_signals || {},
        },
        status: 'completed' as const,
      };

      // Validate that we have at least some data to save
      if (!analysisData.parameters.tickers.length && !Object.keys(analysisData.results.decisions).length) {
        throw new Error('No analysis data to save');
      }

      // Add console.log to debug the data being saved
      console.log('Saving analysis data:', analysisData);
      console.log('Current user:', auth.currentUser.uid);

      const savedAnalysis = await analysisService.createAnalysis(analysisData);
      console.log('Analysis saved successfully:', savedAnalysis);
      
      // Refresh credits after successful save
      // @ts-ignore - Accessing global refresh function
      if (window.refreshCredits) {
        // @ts-ignore
        window.refreshCredits();
      }
      
      alert('Analysis saved successfully!');
    } catch (error) {
      console.error('Error saving analysis:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Failed to save analysis. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="perplexity-card animate-pulse space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-4 w-4 bg-green-200 dark:bg-green-700 rounded-full"></div>
          <div className="h-5 bg-slate-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
        <div className="space-y-3">
          <div className="h-32 bg-slate-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 bg-slate-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-24 bg-slate-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div className="h-40 bg-slate-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!results || (!results.decisions && !results.analyst_signals)) {
    return null;
  }

  const getActionColor = (action: string) => {
    switch(action.toUpperCase()) {
      case 'BUY': return 'text-green-600 dark:text-green-400';
      case 'SELL': return 'text-red-600 dark:text-red-400';
      case 'HOLD': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getSignalColor = (signal: string | null) => {
    if (!signal) return 'badge-gray';
    
    switch(signal.toUpperCase()) {
      case 'BUY': 
      case 'STRONG BUY': return 'badge-green';
      case 'SELL': 
      case 'STRONG SELL': return 'badge-red';
      case 'HOLD': return 'badge-blue';
      case 'NEUTRAL': return 'badge-yellow';
      default: return 'badge-gray';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Analysis Results</h2>
        </div>
        <button
          onClick={handleSaveAnalysis}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span>Save Analysis</span>
        </button>
      </div>
      
      {/* Portfolio Value */}
      {results.decisions?.portfolio_value && (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
          <span className="text-sm font-medium text-slate-700 dark:text-gray-300">Portfolio Value</span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(results.decisions.portfolio_value)}
          </span>
        </div>
      )}
      
      {/* Final Decision Summary */}
      <div className="mt-4">
        <div className="flex items-center mb-4">
          <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Trading Recommendations</h3>
        </div>
        
        {results.decisions && Object.keys(results.decisions).length > 0 && 
         Object.keys(results.decisions).some(key => key !== 'portfolio_value') ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {Object.entries(results.decisions).map(([ticker, decision]) => {
              // Skip portfolio_value as it's not a ticker decision
              if (ticker === 'portfolio_value') return null;
              
              // Skip if invalid data
              if (!decision || typeof decision !== 'object') return null;
              
              const action = decision.action || 'UNKNOWN';
              const quantity = typeof decision.quantity === 'number' ? decision.quantity : 0;
              // Round confidence to nearest integer
              const confidence = decision.confidence ? Math.round(decision.confidence) : null;
              
              // Determine styling based on action
              let bgColor, bgColorDark, borderColor, borderColorDark, textColor, textColorDark, iconPath;
              
              if (action.toUpperCase() === 'BUY') {
                bgColor = 'bg-emerald-50';
                bgColorDark = 'dark:bg-emerald-900/20';
                borderColor = 'border-emerald-200';
                borderColorDark = 'dark:border-emerald-800/30';
                textColor = 'text-emerald-700';
                textColorDark = 'dark:text-emerald-400';
                iconPath = 'M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z';
              } else if (action.toUpperCase() === 'SELL') {
                bgColor = 'bg-red-50';
                bgColorDark = 'dark:bg-red-900/20';
                borderColor = 'border-red-200';
                borderColorDark = 'dark:border-red-800/30';
                textColor = 'text-red-700';
                textColorDark = 'dark:text-red-400';
                iconPath = 'M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z';
              } else if (action.toUpperCase() === 'HOLD') {
                bgColor = 'bg-green-50';
                bgColorDark = 'dark:bg-green-900/20';
                borderColor = 'border-green-200';
                borderColorDark = 'dark:border-green-800/30';
                textColor = 'text-green-700';
                textColorDark = 'dark:text-green-400';
                iconPath = 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
              } else {
                bgColor = 'bg-slate-50';
                bgColorDark = 'dark:bg-slate-800/50';
                borderColor = 'border-slate-200';
                borderColorDark = 'dark:border-slate-700';
                textColor = 'text-slate-700';
                textColorDark = 'dark:text-slate-300';
                iconPath = 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
              }
              
              return (
                <div key={`decision-${ticker}`} className={`p-4 rounded-xl border ${borderColor} ${borderColorDark} ${bgColor} ${bgColorDark} shadow-sm`}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <svg className={`h-5 w-5 mr-1.5 ${textColor} ${textColorDark}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={iconPath} />
                      </svg>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{ticker}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${textColor} ${textColorDark} ${bgColor} ${bgColorDark} border ${borderColor} ${borderColorDark}`}>
                      {action.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {quantity !== 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Quantity:</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{quantity.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {/* Confidence Score - with rounded values */}
                    {confidence && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-slate-600 dark:text-slate-400">Confidence:</span>
                        <div className="flex items-center">
                          <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                confidence > 70 ? 'bg-green-500 dark:bg-green-400' : 
                                confidence > 40 ? 'bg-yellow-500 dark:bg-yellow-400' : 'bg-red-500 dark:bg-red-400'
                              }`} 
                              style={{ width: `${confidence}%` }}
                            ></div>
                          </div>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {confidence}%
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Reasoning */}
                    {decision.reasoning && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-slate-600 dark:text-slate-400 text-xs font-medium mb-1">Reasoning:</div>
                        <p className="text-slate-800 dark:text-slate-300 text-sm">
                          {decision.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700">
            {results.decisions ? (
              <div className="text-center">
                <svg className="mx-auto h-10 w-10 text-green-500 dark:text-green-400 mb-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h18v18H3zM8 12h8"/>
                </svg>
                <h4 className="text-lg font-medium text-slate-800 dark:text-white mb-2">Hold Recommendation</h4>
                <p className="text-slate-600 dark:text-gray-400 mb-4">
                  Our analysis suggests maintaining your current positions. No trades are recommended at this time.
                </p>
                {results.decisions.portfolio_value && (
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-gray-700 rounded-lg inline-block border border-slate-200 dark:border-gray-600">
                    <span className="font-medium text-slate-700 dark:text-gray-300">Current Portfolio Value: </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(results.decisions.portfolio_value)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-10 w-10 text-amber-500 dark:text-amber-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h4 className="text-lg font-medium text-slate-800 dark:text-white mb-2">No Decisions Available</h4>
                <p className="text-slate-600 dark:text-gray-400">
                  Please make sure your analysis is complete and includes portfolio decisions.
                </p>
                
                {/* If there are any recommendations at the root level */}
                {results.decisions && typeof results.decisions === 'object' && 
                  Object.entries(results.decisions)
                    .filter(([key]) => key !== 'portfolio_value')
                    .length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left">
                      <h4 className="font-medium mb-2 dark:text-gray-300">Additional Information:</h4>
                      <div className="text-sm space-y-2">
                        {Object.entries(results.decisions)
                          .filter(([key]) => key !== 'portfolio_value')
                          .map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                              <span className="font-medium dark:text-gray-300">{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:</span>
                              <span className="ml-2 dark:text-gray-400">
                                {typeof value === 'object' 
                                  ? JSON.stringify(value, null, 2) 
                                  : String(value)}
                              </span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )
                }
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Analyst Signals */}
      {results.analyst_signals && Object.keys(results.analyst_signals).length > 0 && (
        <div className="perplexity-card">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Analyst Signal Consensus</h3>
            </div>
            <div className="flex items-center text-sm text-slate-500 dark:text-gray-400 space-x-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></div>
                <span>Buy</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
                <span>Hold</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div>
                <span>Sell</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {(() => {
              try {
                // Make sure we have valid analyst signals to display
                if (!results.analyst_signals || typeof results.analyst_signals !== 'object') {
                  return (
                    <div className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="h-10 w-10 text-slate-300 dark:text-gray-600 mb-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-500 dark:text-gray-400 font-medium mb-1">No analyst signals available</span>
                        <p className="text-xs text-slate-400 dark:text-gray-500 max-w-sm">
                          There are no analyst signals for the selected period.
                        </p>
                      </div>
                    </div>
                  );
                }
                
                // Extract all unique tickers from all analysts
                const allTickers = new Set<string>();
                Object.values(results.analyst_signals).forEach(analystData => {
                  if (analystData && typeof analystData === 'object') {
                    Object.keys(analystData).forEach(ticker => {
                      // Skip risk_management_agent's "reasoning" which isn't a ticker
                      if (ticker !== 'reasoning') {
                        allTickers.add(ticker);
                      }
                    });
                  }
                });
                
                // Get array of all tickers
                const tickers = Array.from(allTickers);
                
                // Create a section for each ticker
                return tickers.map((ticker, index) => {
                  // Gather all signals from different analysts for this ticker
                  const analystSignals: Record<string, any> = {};
                  
                  Object.entries(results.analyst_signals!).forEach(([analystName, analystData]) => {
                    if (analystData && typeof analystData === 'object' && analystData[ticker]) {
                      analystSignals[analystName] = analystData[ticker];
                    }
                  });
                  
                  // Skip if no signals for this ticker
                  if (Object.keys(analystSignals).length === 0) {
                    return null;
                  }
                  
                  return (
                    <div key={ticker} className={`bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden shadow-sm ${index > 0 ? 'mt-6' : ''}`}>
                      {/* Ticker header */}
                      <div className="bg-slate-50 dark:bg-gray-800/80 border-b border-slate-200 dark:border-gray-700 px-4 py-3 flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3 text-green-600 dark:text-green-400 font-bold text-lg">
                          {ticker.charAt(0)}
                        </div>
                        <h4 className="text-xl font-bold text-slate-700 dark:text-gray-200">{ticker}</h4>
                      </div>
                      
                      {/* Signals table for this ticker */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead className="bg-slate-50 dark:bg-gray-800">
                            <tr>
                              <th className="text-left py-2 px-4 text-sm font-medium text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700 w-1/3">Analyst</th>
                              <th className="text-left py-2 px-4 text-sm font-medium text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700 w-1/3">Signal</th>
                              <th className="text-right py-2 px-4 text-sm font-medium text-slate-600 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700">Confidence</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(analystSignals).map(([analyst, data]) => {
                              // Skip risk_management_agent as it doesn't have a signal property
                              if (analyst === 'risk_management_agent') {
                                return null;
                              }
                              
                              // Skip invalid data
                              if (!data || typeof data !== 'object' || !data.signal) {
                                return null;
                              }
                              
                              // Get the rounded confidence
                              const confidence = data.confidence !== null && data.confidence !== undefined
                                ? Math.round(data.confidence)
                                : null;
                              
                              // Format the analyst name (remove underscores and capitalize)
                              const formattedAnalyst = analyst.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ');
                              
                              // Normalize signal names to match our styling
                              let normalizedSignal = data.signal.toUpperCase();
                              if (normalizedSignal === 'BULLISH') normalizedSignal = 'BUY';
                              if (normalizedSignal === 'BEARISH') normalizedSignal = 'SELL';
                              
                              // Determine signal styling
                              let signalBgClass, signalTextClass;
                              if (normalizedSignal === 'BUY' || normalizedSignal === 'STRONG BUY' || normalizedSignal === 'BULLISH') {
                                signalBgClass = 'bg-emerald-100 dark:bg-emerald-900/30';
                                signalTextClass = 'text-emerald-800 dark:text-emerald-400';
                              } else if (normalizedSignal === 'SELL' || normalizedSignal === 'STRONG SELL' || normalizedSignal === 'BEARISH') {
                                signalBgClass = 'bg-red-100 dark:bg-red-900/30';
                                signalTextClass = 'text-red-800 dark:text-red-400';
                              } else if (normalizedSignal === 'HOLD' || normalizedSignal === 'NEUTRAL') {
                                signalBgClass = 'bg-green-100 dark:bg-green-900/30';
                                signalTextClass = 'text-green-800 dark:text-green-400';
                              } else {
                                signalBgClass = 'bg-gray-100 dark:bg-gray-900/30';
                                signalTextClass = 'text-gray-800 dark:text-gray-400';
                              }
                              
                              // Determine confidence bar color
                              let confidenceBarColor;
                              if (normalizedSignal === 'BUY' || normalizedSignal === 'STRONG BUY' || normalizedSignal === 'BULLISH') {
                                confidenceBarColor = 'bg-emerald-500 dark:bg-emerald-400';
                              } else if (normalizedSignal === 'SELL' || normalizedSignal === 'STRONG SELL' || normalizedSignal === 'BEARISH') {
                                confidenceBarColor = 'bg-red-500 dark:bg-red-400';
                              } else {
                                confidenceBarColor = 'bg-green-500 dark:bg-green-400';
                              }
                              
                              return (
                                <tr 
                                  key={analyst} 
                                  className="hover:bg-slate-50 dark:hover:bg-gray-800/70 cursor-pointer"
                                  onClick={() => {
                                    if (data.reasoning) {
                                      console.log("Row clicked, setting selectedAnalyst:", {
                                        ticker,
                                        analyst: formattedAnalyst,
                                        reasoning: typeof data.reasoning === 'string' ? data.reasoning : JSON.stringify(data.reasoning, null, 2)
                                      });
                                      setSelectedAnalyst({
                                        ticker,
                                        analyst: formattedAnalyst,
                                        reasoning: typeof data.reasoning === 'string' ? data.reasoning : JSON.stringify(data.reasoning, null, 2)
                                      });
                                    }
                                  }}
                                >
                                  <td className="py-3 px-4 font-medium dark:text-gray-300 border-b border-slate-100 dark:border-gray-800">
                                    {formattedAnalyst}
                                  </td>
                                  <td className="py-3 px-4 border-b border-slate-100 dark:border-gray-800">
                                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${signalBgClass} ${signalTextClass}`}>
                                      {data.signal || 'N/A'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right border-b border-slate-100 dark:border-gray-800">
                                    {confidence !== null ? (
                                      <div className="flex items-center justify-end">
                                        <div className="w-24 h-3 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden mr-2">
                                          <div 
                                            className={`h-full ${confidenceBarColor}`}
                                            style={{ width: `${confidence}%` }}
                                          ></div>
                                        </div>
                                        <span className="font-medium tabular-nums dark:text-gray-300">
                                          {confidence}%
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-slate-400 dark:text-gray-500">N/A</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })
              } catch (error) {
                console.error('Error rendering analyst signals:', error);
                return (
                  <div className="px-6 py-4 text-center text-red-500 dark:text-red-400">
                    Error displaying analyst signals
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}
      
      {/* Add the modal at the end, but still inside the main return div */}
      {selectedAnalyst && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {selectedAnalyst.ticker}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedAnalyst.analyst} Analysis
                </h3>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => setSelectedAnalyst(null)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              {(selectedAnalyst.analyst === "Fundamentals Agent" || selectedAnalyst.analyst === "Valuation Agent") && typeof selectedAnalyst.reasoning === 'string' ? (
                <div className="space-y-4">
                  {(() => {
                    try {
                      // Parse the reasoning JSON if it's a string
                      const reasoningObj = JSON.parse(selectedAnalyst.reasoning);
                      
                      // Define signal type colors and icons
                      const getSignalDisplay = (signal: string) => {
                        const normalizedSignal = signal.toLowerCase();
                        if (normalizedSignal === 'bullish') {
                          return {
                            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                            border: 'border-emerald-200 dark:border-emerald-800/30',
                            text: 'text-emerald-700 dark:text-emerald-400',
                            icon: (
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                              </svg>
                            )
                          };
                        } else if (normalizedSignal === 'bearish') {
                          return {
                            bg: 'bg-red-50 dark:bg-red-900/20',
                            border: 'border-red-200 dark:border-red-800/30',
                            text: 'text-red-700 dark:text-red-400',
                            icon: (
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                              </svg>
                            )
                          };
                        } else {
                          return {
                            bg: 'bg-green-50 dark:bg-green-900/20',
                            border: 'border-green-200 dark:border-green-800/30',
                            text: 'text-green-700 dark:text-green-400',
                            icon: (
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            )
                          };
                        }
                      };
                      
                      // Format signal name for display
                      const formatSignalName = (name: string) => {
                        return name.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ').replace('Signal', '').replace('Analysis', '');
                      };
                      
                      // For valuation agent, customize how we display the details
                      const formatDetails = (details: string, isValuationAgent: boolean) => {
                        if (!isValuationAgent) {
                          // Standard display for fundamentals agent
                          return details.split(', ').map((detail: string, i: number) => (
                            <div key={i} className="flex items-center justify-between">
                              <span>{detail.split(': ')[0]}:</span>
                              <span className="font-medium">{detail.split(': ')[1]}</span>
                            </div>
                          ));
                        } else {
                          // Enhanced display for valuation agent with gap highlighting
                          return details.split(', ').map((detail: string, i: number) => {
                            const [label, value] = detail.split(': ');
                            
                            // Add special styling for the Gap metric
                            if (label === 'Gap') {
                              const gapValue = parseFloat(value.replace('%', ''));
                              const gapColor = gapValue >= 0 
                                ? 'text-emerald-600 dark:text-emerald-400' 
                                : 'text-red-600 dark:text-red-400';
                              
                              return (
                                <div key={i} className="flex items-center justify-between font-medium">
                                  <span>{label}:</span>
                                  <span className={gapColor}>{value}</span>
                                </div>
                              );
                            }
                            
                            return (
                              <div key={i} className="flex items-center justify-between">
                                <span>{label}:</span>
                                <span className="font-medium">{value}</span>
                              </div>
                            );
                          });
                        }
                      };
                      
                      const isValuationAgent = selectedAnalyst.analyst === "Valuation Agent";
                      
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(reasoningObj).map(([key, value]: [string, any]) => {
                            const display = getSignalDisplay(value.signal);
                            return (
                              <div 
                                key={key} 
                                className={`p-4 rounded-lg border ${display.border} ${display.bg}`}
                              >
                                <div className="flex items-center mb-2">
                                  <div className={`flex-shrink-0 mr-2 ${display.text}`}>
                                    {display.icon}
                                  </div>
                                  <h4 className="font-medium text-gray-800 dark:text-white">
                                    {formatSignalName(key)}
                                  </h4>
                                  <span className={`ml-auto text-sm font-medium capitalize ${display.text}`}>
                                    {value.signal}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  {formatDetails(value.details, isValuationAgent)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    } catch (error) {
                      console.error("Error parsing agent data:", error);
                      return <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {selectedAnalyst.reasoning || "No detailed reasoning available."}
                      </div>
                    }
                  })()}
                </div>
              ) : (
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedAnalyst.reasoning || "No detailed reasoning available."}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                onClick={() => setSelectedAnalyst(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;