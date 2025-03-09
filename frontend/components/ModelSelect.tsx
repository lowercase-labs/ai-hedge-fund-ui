'use client';

import React, { useState, useEffect } from 'react';
import type { Model } from '@/types/api';
import { getModels } from '@/lib/api';

interface ModelSelectProps {
  selectedModel: string;
  onChange: (model: string) => void;
}

const ModelSelect: React.FC<ModelSelectProps> = ({ selectedModel, onChange }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await getModels();
        setModels(response.models);
        
        // Set default model if none is selected
        if (!selectedModel && response.models.length > 0) {
          onChange(response.models[0].value);
        }
      } catch (err) {
        setError('Failed to load models');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [onChange, selectedModel]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <label htmlFor="model-select" className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 block">AI Model</label>
      <div className="relative">
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => onChange(e.target.value)}
          className="input appearance-none pr-10 py-2.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {models.map((model) => (
            <option key={model.value} value={model.value}>
              {model.display}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-3 h-4 w-4 text-slate-400 dark:text-gray-500 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">
        More advanced models may provide more accurate insights.
      </p>
    </div>
  );
};

export default ModelSelect;