import { Analysis } from '@/services/analysis/analysis.service';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface AnalysisCardProps {
  analysis: Analysis;
  onDelete: (id: string) => void;
}

export function AnalysisCard({ analysis, onDelete }: AnalysisCardProps) {
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold dark:text-white">{analysis.title}</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(analysis.createdAt)}
        </span>
      </div>
      
      {analysis.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-4">{analysis.description}</p>
      )}
      
      <div className="flex items-center gap-4 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          analysis.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          analysis.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {analysis.status.replace('_', ' ')}
        </span>
        {analysis.parameters?.portfolio_value && (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Portfolio: ${analysis.parameters.portfolio_value.toLocaleString()}
          </span>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <Link
          href={`/analysis/${analysis.id}`}
          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
        >
          View Details
        </Link>
        <button
          onClick={() => onDelete(analysis.id)}
          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
} 