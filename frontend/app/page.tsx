'use client';

import ProtectedRoute from '../components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      {/* Your protected page content */}
      <div>
        <h1>Protected Home Page</h1>
      </div>
    </ProtectedRoute>
  );
}