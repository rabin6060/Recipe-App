
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export interface notification{
  username:string
  time:string
  content:string
  userId:string
}
// Define a type for the context value
interface NotificationContextType {
  
  loading: boolean | false;
  setLoading:(recipe: boolean | false) => void;
  notifications: notification[] | [];
  setNotifications: (notifications: notification[] | []) => void;
  socket:Socket | null;
  setSocket:(socket:Socket)=>void
}

// Create the context with a default value
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Create a provider component
const NotificationProvider: React.FC<{ children: ReactNode,url:string,userId:string }> = ({ children,url,userId }) => {
  
  const [loading, setLoading] = useState<boolean>(true);

  const [notifications,setNotifications] = useState<notification[] | []>([])
  const [socket,setSocket] = useState<Socket | null>(null)
  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);

    newSocket.emit('register', userId);

    newSocket.on('notification', (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    return () => {
      newSocket.close();
    };
  }, [url, userId]);
  
  

  return <NotificationContext.Provider value={{ socket,setSocket ,loading,setLoading, notifications,setNotifications }}>{children}</NotificationContext.Provider>;
};

// Create a custom hook to use the NotificationContext
const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export { NotificationProvider, useNotification };
