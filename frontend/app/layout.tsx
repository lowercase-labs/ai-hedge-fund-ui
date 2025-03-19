import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '../components/ThemeProvider';
import AuthLayout from '../components/AuthLayout';

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
      <ThemeProvider>
        <AuthLayout>
          {children}
        </AuthLayout>
      </ThemeProvider>
    </html>
  );
}