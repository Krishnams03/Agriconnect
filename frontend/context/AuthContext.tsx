// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of the authentication state
interface AuthContextType {
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (name: string, email: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to access the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Effect to handle user session persistence
  useEffect(() => {
    // This is an example; ideally, you would check cookies/local storage or make an API call to check auth status
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login handler
  const login = (email: string, password: string) => {
    // Simulate an API request to login and get user data (replace with real API call)
    const mockUser = { name: 'John Doe', email }; // Replace with actual user data
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Register handler (for simplicity, this is similar to login)
  const register = (name: string, email: string, password: string) => {
    // Simulate a registration API call and return user data
    const newUser = { name, email }; // Replace with actual user registration logic
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
