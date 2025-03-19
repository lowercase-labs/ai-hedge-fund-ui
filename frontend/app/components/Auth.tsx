'use client';

import { useState } from 'react';
import { authService } from '../../services/auth/auth.service';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await authService.signInWithGoogle();
      // Handle successful sign-in (e.g., redirect)
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.signInWithEmail(email, password);
      // Handle successful sign-in
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  return (
    <div className="auth-container">
      <button onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>

      <form onSubmit={handleEmailSignIn}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign in with Email</button>
      </form>
    </div>
  );
} 