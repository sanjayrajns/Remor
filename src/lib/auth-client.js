import { createAuthClient } from 'better-auth/react';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return window.location.origin;
    }
  }
  return 'http://localhost:3001';
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  basePath: '/api/auth',
});

export const { signIn, signUp, signOut, useSession } = authClient;
