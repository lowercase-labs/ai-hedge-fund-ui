'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't apply AuthLayout to the index page or login page
  const isPublicRoute = pathname === '/' || pathname === '/login';

  if (!mounted) {
    return null;
  }

  return (
    <html lang="en" className="light">
      <body className={`${inter.className} overflow-y-auto`}>
        <ThemeProvider>
          {isPublicRoute ? children : <AuthLayout>{children}</AuthLayout>}
        </ThemeProvider>
      </body>
    </html>
  );
}