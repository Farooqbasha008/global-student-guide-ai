import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  novitaApiKey?: string;
}

interface AuthToken {
  user: User;
  exp: number;
}

// Generate a simple JWT token (for demo purposes)
const generateToken = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    user,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }));
  const signature = btoa('demo-signature'); // In production, use proper signing
  return `${header}.${payload}.${signature}`;
};

// Verify token and return user data
export const verifyToken = (token: string): User | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = jwtDecode<AuthToken>(atob(payload));
    
    if (decoded.exp * 1000 < Date.now()) {
      return null; // Token expired
    }
    
    return decoded.user;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Login function
export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  // In a real app, this would make an API call
  // For demo, we'll simulate a successful login
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    name: email.split('@')[0],
    email,
  };
  
  const token = generateToken(user);
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return { token, user };
};

// Signup function
export const signup = async (name: string, email: string, password: string): Promise<{ token: string; user: User }> => {
  // In a real app, this would make an API call
  // For demo, we'll simulate a successful signup
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
  };
  
  const token = generateToken(user);
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return { token, user };
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  return verifyToken(token);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  if (!token) return false;
  
  return verifyToken(token) !== null;
}; 