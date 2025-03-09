'use client';

import React, { useState, useEffect } from 'react';
import type { Analyst } from '@/types/api';
import { getAnalysts } from '@/lib/api';

interface AnalystSelectProps {
  selectedAnalysts: string[];
  onChange: (analysts: string[]) => void;
}

const AnalystSelect: React.FC<AnalystSelectProps> = ({ selectedAnalysts, onChange }) => {
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysts = async () => {
      try {
        setLoading(true);
        const response = await getAnalysts();
        setAnalysts(response.analysts);
        
        // If no analysts are selected, select all by default
        if (selectedAnalysts.length === 0) {
          onChange(response.analysts.map(a => a.value));
        }
      } catch (err) {
        setError('Failed to load analysts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysts();
  }, [onChange]);

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      onChange(analysts.map(a => a.value));
    } else {
      onChange([]);
    }
  };

  const handleToggleAnalyst = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedAnalysts, value]);
    } else {
      onChange(selectedAnalysts.filter(a => a !== value));
    }
  };

  if (loading) {
    return (
      <div className="perplexity-card animate-pulse">
        <div className="h-5 bg-slate-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-6 bg-slate-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error dark:bg-red-900 dark:text-red-200 dark:border dark:border-red-800">{error}</div>;
  }

  // Helper function to get the appropriate avatar for each analyst
  const getAnalystAvatar = (analystValue: string) => {
    // Map each analyst to their respective avatar
    switch(analystValue) {
      case 'warren_buffett':
        return "👴"; // Warren Buffett avatar
      case 'ben_graham':
        return "👨‍🏫"; // Ben Graham avatar
      case 'bill_ackman':
        return "👨‍💼"; // Bill Ackman avatar
      case 'charlie_munger':
        return "🧓"; // Charlie Munger avatar
      case 'cathie_wood':
        return "👩‍💼"; // Cathie Wood avatar
      case 'fundamentals':
        return "📊"; // Fundamentals avatar
      case 'valuation':
        return "💰"; // Valuation avatar
      case 'technicals':
        return "📈"; // Technicals avatar
      case 'sentiment':
        return "🧠"; // Sentiment avatar
      default:
        return "👤"; // Default avatar
    }
  };

  // Split analysts into two categories: famous investors and technical analysts
  const famousInvestors = analysts.filter(analyst => 
    ['warren_buffett', 'ben_graham', 'bill_ackman', 'charlie_munger', 'cathie_wood'].includes(analyst.value)
  );
  
  // For technical analysts, include any that are not in the famous investors list
  const technicalAnalysts = analysts.filter(analyst => 
    !['warren_buffett', 'ben_graham', 'bill_ackman', 'charlie_munger', 'cathie_wood'].includes(analyst.value)
  );

  return (
    <div className="perplexity-card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-slate-700 dark:text-gray-300">Select AI Analysts</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="select-all-analysts"
            checked={selectedAnalysts.length === analysts.length}
            onChange={(e) => handleToggleAll(e.target.checked)}
            className="h-4 w-4 text-blue-500 focus:ring-blue-300 border-slate-300 dark:border-gray-600 rounded dark:bg-gray-700"
          />
          <label htmlFor="select-all-analysts" className="ml-2 text-xs text-slate-600 dark:text-gray-400">Select All</label>
        </div>
      </div>
      <div className="max-w-2xl mx-auto">
      
      {/* Famous Investors Section */}
      <div className="mb-5">
        <h4 className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase mb-3 pl-1">Famous Investors</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {famousInvestors.map((analyst) => {
            // Get investor images
            let imageUrl = '';
            let description = '';
            
            // Generate a fallback SVG for each investor
            const fallbackImageUrl = '/images/analysts/default.svg';
            
            switch(analyst.value) {
              case 'warren_buffett':
                imageUrl = '/images/analysts/warren_buffett.jpg';
                description = 'The Oracle of Omaha';
                break;
              case 'ben_graham':
                imageUrl = '/images/analysts/ben_graham.jpg';
                description = 'Father of Value Investing';
                break;
              case 'bill_ackman':
                imageUrl = '/images/analysts/bill_ackman.jpg';
                description = 'Activist Investor';
                break;
              case 'charlie_munger':
                imageUrl = '/images/analysts/charlie_munger.jpg';
                description = 'Berkshire Hathaway Vice Chairman';
                break;
              case 'cathie_wood':
                imageUrl = '/images/analysts/cathie_wood.jpg';
                description = 'ARK Invest Founder';
                break;
              default:
                imageUrl = fallbackImageUrl;
                description = 'Analyst';
            }
            
            // Use the SVG fallback if the JPG is likely not available yet
            const imageExists = false; // Set this to true once you've added the image files
            if (!imageExists && imageUrl !== fallbackImageUrl) {
              // Use specific SVG placeholder for each analyst if available
              const svgPath = `/images/analysts/${analyst.value}.svg`;
              imageUrl = svgPath;
            }
            
            const isSelected = selectedAnalysts.includes(analyst.value);
            
            return (
              <div 
                key={analyst.value} 
                className={`rounded-xl overflow-hidden border-2 w-full ${
                  isSelected
                    ? 'border-blue-300 ring-2 ring-blue-200 dark:border-blue-600 dark:ring-blue-900' 
                    : 'border-slate-200 hover:border-slate-300 dark:border-gray-700 dark:hover:border-gray-600'
                } transition-all cursor-pointer shadow-sm hover:shadow`}
                onClick={() => handleToggleAnalyst(analyst.value, !isSelected)}
              >
                <div className="relative">
                  {/* Image */}
                  <div className="h-24 w-full bg-slate-100 dark:bg-gray-700 overflow-hidden relative">
                    <div className="w-full h-full flex items-center justify-center">
                      {/* Fallback icon - shown while image loads or if image fails */}
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-50 dark:bg-blue-900 z-0">
                        <svg 
                          className="h-12 w-12 text-blue-400 dark:text-blue-300" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                          />
                        </svg>
                      </div>
                      
                      {/* Next.js Image component - positioned above the fallback */}
                      <div className="relative w-full h-full z-10">
                        <img 
                          src={imageUrl} 
                          alt={analyst.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If image fails to load, use analyst-specific SVG or default SVG
                            const target = e.target as HTMLImageElement;
                            const analystValue = analyst.value;
                            
                            // Try to load the analyst-specific SVG
                            const specificSvg = `/images/analysts/${analystValue}.svg`;
                            const defaultSvg = `/images/analysts/default.svg`;
                            
                            // Set source to the analyst-specific SVG with a fallback to default.svg if that also fails
                            target.onerror = () => {
                              // If the specific SVG also fails, use default.svg
                              target.onerror = null; // Prevent infinite error loop
                              target.src = defaultSvg;
                            };
                            target.src = specificSvg;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Checkbox overlay */}
                  <div className="absolute top-2 right-2">
                    <div className={`h-5 w-5 rounded-full ${
                      isSelected 
                        ? 'bg-blue-500 dark:bg-blue-600' 
                        : 'bg-white/80 border border-slate-300 dark:bg-gray-800/80 dark:border-gray-600'
                    } flex items-center justify-center`}>
                      {isSelected && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-3">
                  <h4 className="font-medium text-sm text-slate-800 dark:text-gray-200 line-clamp-1">
                    {analyst.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Technical Analysts Section */}
      <div>
        <h4 className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase mb-3 pl-1">Technical Analysts</h4>
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          {technicalAnalysts.map((analyst) => {
            // Get analyst icon and description
            let icon = '';
            let iconColor = '';
            let description = '';
            
            switch(analyst.value) {
              case 'fundamentals':
                icon = 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
                iconColor = 'text-emerald-500 dark:text-emerald-400';
                description = 'Financial statement analysis';
                break;
              case 'technicals':
                icon = 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6';
                iconColor = 'text-blue-500 dark:text-blue-400';
                description = 'Chart pattern analysis';
                break;
              case 'valuation':
                icon = 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
                iconColor = 'text-amber-500 dark:text-amber-400';
                description = 'Discounted cash flow analysis';
                break;
              case 'sentiment':
                icon = 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
                iconColor = 'text-purple-500 dark:text-purple-400';
                description = 'Market sentiment analysis';
                break;
              case 'risk_manager':
                icon = 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
                iconColor = 'text-red-500 dark:text-red-400';
                description = 'Risk assessment';
                break;
              case 'portfolio_manager':
                icon = 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10';
                iconColor = 'text-indigo-500 dark:text-indigo-400';
                description = 'Portfolio optimization';
                break;
              default:
                icon = 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
                iconColor = 'text-gray-500 dark:text-gray-400';
                description = 'Analysis technique';
            }
            
            const isSelected = selectedAnalysts.includes(analyst.value);
            
            return (
              <div 
                key={analyst.value} 
                className={`p-3 rounded-xl border-2 w-full ${
                  isSelected
                    ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30' 
                    : 'border-slate-200 hover:border-slate-300 bg-white dark:border-gray-700 dark:hover:border-gray-600 dark:bg-gray-800'
                } transition-colors cursor-pointer shadow-sm hover:shadow flex items-center`}
                onClick={() => handleToggleAnalyst(analyst.value, !isSelected)}
              >
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h4 className="font-medium text-sm text-slate-800 dark:text-gray-200 truncate pr-2">
                      {analyst.name}
                    </h4>
                    {isSelected && (
                      <svg className="h-4 w-4 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400 truncate">
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AnalystSelect;