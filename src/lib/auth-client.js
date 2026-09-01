import { createAuthClient } from 'better-auth/react';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3001';
    }
    return window.location.origin;
  }
  return 'http://localhost:3001';
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  basePath: '/api/auth',
});

export const { signIn, signUp, signOut, useSession } = authClient;
