'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../services/config/init';
import { User } from 'firebase/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('ProtectedRoute: Initializing auth state check');
    
    // Check if there's already a user
    const currentUser = auth.currentUser;
    console.log('ProtectedRoute: Current user state:', {
      isAuthenticated: !!currentUser,
      userId: currentUser?.uid,
      email: currentUser?.email
    });

    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('ProtectedRoute: Auth state changed:', {
        isAuthenticated: !!user,
        userId: user?.uid,
        email: user?.email
      });

      setUser(user);
      setLoading(false);
      
      if (!user) {
        console.log('ProtectedRoute: No user, redirecting to login');
        router.push('/login');
      }
    });

    return () => {
      console.log('ProtectedRoute: Cleaning up auth listener');
      unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 