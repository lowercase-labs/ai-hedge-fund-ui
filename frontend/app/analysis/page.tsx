'use client';

import { useEffect, useState } from 'react';
import { analysisService, Analysis } from '@/services/analysis/analysis.service';
import { AnalysisCard } from '@/components/AnalysisCard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AnalysisPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      const data = await analysisService.getAnalyses();
      setAnalyses(data);
      setError(null);
    } catch (err) {
      setError('Failed to load analyses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await analysisService.deleteAnalysis(id);
      setAnalyses(analyses.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete analysis:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Analysis History</h1>
        
        {analyses.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No analyses found. Run an analysis to see results here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => (
              <AnalysisCard
                key={analysis.id}
                analysis={analysis}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 