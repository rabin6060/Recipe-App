import { getAllUsers } from '@/api/user';
import { AllUserInfo, UserInfo } from '@/pages/Login/type';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define a type for the context value
interface UserContextType {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  loading: boolean | false;
  users: AllUserInfo | null;
  setUsers: (users: AllUserInfo | null) => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<AllUserInfo | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await getAllUsers();
        if (!response) {
          console.log('sorry');
        }
        
        setUsers(response.data);
      } catch (error) {
        console.log('sorry');
      }
    }
    getUser();
  }, []);

  return <UserContext.Provider value={{ user, setUser, loading, users, setUsers }}>{children}</UserContext.Provider>;
};

// Create a custom hook to use the UserContext
const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };
