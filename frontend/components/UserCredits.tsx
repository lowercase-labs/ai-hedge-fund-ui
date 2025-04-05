import { useEffect, useState, useCallback } from 'react';
import { userService, UserCredits } from '@/services/user/user.service';

export function UserCredits() {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCredits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getUserCredits();
      setCredits(data);
      setError(null);
    } catch (err) {
      console.error('Error loading credits:', err);
      setError('Failed to load credits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCredits();
  }, [loadCredits]);

  // Expose refresh function to parent components
  useEffect(() => {
    // @ts-ignore - Adding to window for global access
    window.refreshCredits = loadCredits;
    return () => {
      // @ts-ignore
      delete window.refreshCredits;
    };
  }, [loadCredits]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error || !credits) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800/50">
      <svg 
        className="h-4 w-4 text-blue-500 dark:text-blue-400" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
        {credits.credits}
      </span>
    </div>
  );
} 