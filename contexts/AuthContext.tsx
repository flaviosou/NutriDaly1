import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthContextType } from '../types';
import { mockUsers } from '../data/mockData';


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('nutridaily-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Sync with mock data in case of role change by admin
        const liveUser = mockUsers.find(u => u.uid === parsedUser.uid);
        setUser(liveUser || parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('nutridaily-user');
    }
    setLoading(false);
  }, []);
  
  const updateUserStateAndStorage = (updatedUser: User) => {
      setUser(updatedUser);
      localStorage.setItem('nutridaily-user', JSON.stringify(updatedUser));
      const userIndex = mockUsers.findIndex(u => u.uid === updatedUser.uid);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
  }

  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      updateUserStateAndStorage(foundUser);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nutridaily-user');
  };

  const register = async (data: Omit<User, 'uid' | 'role' | 'createdAt' | 'avatarUrl' | 'following' | 'followers' | 'bio'> & { password?: string }): Promise<boolean> => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 500));
      if (mockUsers.some(u => u.email === data.email)) {
          setLoading(false);
          return false;
      }
      const { password, ...userData } = data; // remove password from userData
      const newUser: User = {
          ...userData,
          uid: `user-${Date.now()}`,
          role: UserRole.Member,
          createdAt: new Date().toISOString(),
          avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
          bio: '',
          following: [],
          followers: [],
      };
      mockUsers.push(newUser);
      updateUserStateAndStorage(newUser);
      setLoading(false);
      return true;
  }

  const updateUserProfile = (updatedData: Partial<Pick<User, 'name' | 'avatarUrl' | 'preferences' | 'age' | 'heightCm' | 'weightKg' | 'bio'>>) => {
    if (user) {
        const updatedUser = { ...user, ...updatedData };
        updateUserStateAndStorage(updatedUser);
    }
  };


  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, register, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};