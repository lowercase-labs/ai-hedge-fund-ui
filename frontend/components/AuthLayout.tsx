'use client';

import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../services/config/init';
import { authService } from '../services/auth/auth.service';
import ThemeToggle from './ThemeToggle';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <body className="bg-slate-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L1 21h22L12 2zm0 4.6L19.1 19H4.9L12 6.6z" />
            </svg>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-white">AI Hedge Fund UI</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/analysis"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Analysis
                </Link>
              </>
            )}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-700 dark:text-gray-300">
                      {user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <a
                      href="/login"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sign In
                    </a>
                  </div>
                )}
              </>
            )}
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
    </body>
  );
} 