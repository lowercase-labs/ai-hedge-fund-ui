'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { analysisService, Analysis } from '@/services/analysis/analysis.service';
import ProtectedRoute from '@/components/ProtectedRoute';
import { formatDistanceToNow } from 'date-fns';
import { auth } from '@/services/config/init';

export default function AnalysisDetailPage() {
  const params = useParams();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth to be initialized
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('AnalysisDetailPage: Auth state changed:', {
        isAuthenticated: !!user,
        userId: user?.uid,
        email: user?.email
      });

      if (user) {
        loadAnalysis();
      }
    });

    return () => {
      console.log('AnalysisDetailPage: Cleaning up auth listener');
      unsubscribe();
    };
  }, [params.id]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      console.log('AnalysisDetailPage: Loading analysis with ID:', params.id);
      
      if (!auth.currentUser) {
        console.error('AnalysisDetailPage: No authenticated user');
        throw new Error('User must be authenticated');
      }

      const data = await analysisService.getAnalysis(params.id as string);
      console.log('AnalysisDetailPage: Analysis loaded successfully:', data);
      setAnalysis(data);
      setError(null);
    } catch (err) {
      console.error('AnalysisDetailPage: Error loading analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const formatJsonData = (data: any) => {
    if (!data) return null;

    const formatValue = (value: any): string => {
      if (value === null) return 'null';
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return value.map(formatValue).join(', ');
        }
        return JSON.stringify(value);
      }
      return String(value);
    };

    // If it's a simple object with portfolio_value and tickers
    if (data.portfolio_value !== undefined && Array.isArray(data.tickers)) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium dark:text-gray-300">Portfolio Value:</span>
            <span className="text-green-600 dark:text-green-400">${data.portfolio_value.toLocaleString()}</span>
          </div>
          <div>
            <span className="font-medium dark:text-gray-300 block mb-2">Tickers:</span>
            <div className="flex flex-wrap gap-2">
              {data.tickers.map((ticker: string) => (
                <span key={ticker} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  {ticker}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // If it's a decisions object with detailed decision data
    if (data.decisions) {
      return (
        <div className="space-y-4">
          {Object.entries(data.decisions).map(([ticker, decision]: [string, any]) => {
            if (ticker === 'portfolio_value') return null;
            
            const actionColor = 
              decision.action === 'BUY' ? 'text-green-600 dark:text-green-400' :
              decision.action === 'SELL' ? 'text-red-600 dark:text-red-400' :
              'text-blue-600 dark:text-blue-400';
            
            return (
              <div key={ticker} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium dark:text-gray-300">{ticker}</span>
                  <span className={actionColor}>{decision.action}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
                    <span className="ml-2 dark:text-gray-300">{decision.quantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Confidence:</span>
                    <span className="ml-2 dark:text-gray-300">{(decision.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">Reasoning:</span>
                    <p className="mt-1 dark:text-gray-300">{decision.reasoning}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    
    // If it's analyst signals
    if (data.analyst_signals) {
      return (
        <div className="space-y-4">
          {Object.entries(data.analyst_signals).map(([ticker, analysts]: [string, any]) => (
            <div key={ticker} className="border-b border-gray-200 dark:border-gray-700 pb-3">
              <h3 className="font-medium dark:text-gray-300 mb-2">{ticker}</h3>
              <div className="space-y-2">
                {Object.entries(analysts).map(([analyst, signal]: [string, any]) => (
                  <div key={analyst} className="flex justify-between items-center">
                    <span className="text-sm dark:text-gray-400">{analyst}:</span>
                    <span className={`text-sm ${
                      signal === 'BUY' ? 'text-green-600 dark:text-green-400' :
                      signal === 'SELL' ? 'text-red-600 dark:text-red-400' :
                      'text-blue-600 dark:text-blue-400'
                    }`}>
                      {signal}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Default JSON display for other data
    return (
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start">
            <span className="font-medium dark:text-gray-300">{key}:</span>
            <span className="dark:text-gray-400 ml-4 text-right">
              {formatValue(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error || !analysis ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500 dark:text-red-400">{error || 'Analysis not found'}</div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
            >
              ← Back to Analyses
            </button>
            <h1 className="text-3xl font-bold dark:text-white">{analysis.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{analysis.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                analysis.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                analysis.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {analysis.status.replace('_', ' ')}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(analysis.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>

          {analysis.errorMessage && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              <h2 className="font-semibold mb-2">Error</h2>
              <p>{analysis.errorMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Parameters</h2>
              {formatJsonData(analysis.parameters)}
            </div>

            {analysis.results && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Results</h2>
                {formatJsonData(analysis.results)}
              </div>
            )}
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
} 