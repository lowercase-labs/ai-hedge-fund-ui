import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '../components/ThemeProvider';
import ThemeToggle from '../components/ThemeToggle';

export const metadata: Metadata = {
  title: 'AI Hedge Fund UI',
  description: 'AI-powered financial analysis and trading recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-slate-50 dark:bg-gray-900 transition-colors duration-200">
        <ThemeProvider>
          <header className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L1 21h22L12 2zm0 4.6L19.1 19H4.9L12 6.6z" />
                </svg>
                <h1 className="text-xl font-semibold text-slate-800 dark:text-white">AI Hedge Fund UI</h1>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
              </nav>
              <div className="hidden md:flex items-center space-x-4">
                <ThemeToggle />
                
              </div>
            </div>
          </header>
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-white dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L1 21h22L12 2zm0 4.6L19.1 19H4.9L12 6.6z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-700 dark:text-gray-300">AI Hedge Fund UI</span>
                </div>
                <div className="flex space-x-6">
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}