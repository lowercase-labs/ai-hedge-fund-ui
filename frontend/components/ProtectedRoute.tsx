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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      
      if (!user) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  return user ? <>{children}</> : null;
} 