
import { get } from '@/api/notification';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export interface notification{
  username:string
  time:string
  content:string
  userId:string
}

export interface Chat{
  toUserId:string,
  fromUser:string,
  fromUserId:string,
  time:string,
  content:string,
  
}
// Define a type for the context value
export interface NotificationContextType {
  
  loading: boolean | false;
  setLoading:(recipe: boolean | false) => void;
  notifications: notification[] | [];
  setNotifications: (notifications: notification[] | []) => void;
  socket:Socket | null;
  setSocket:(socket:Socket)=>void;
  chats : Chat[] | [],
  setChats: (chats: Chat[] | []) => void

}

// Create the context with a default value
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Create a provider component
const NotificationProvider: React.FC<{ children: ReactNode,url:string,userId:string }> = ({ children,url,userId }) => {
  
  const [loading, setLoading] = useState<boolean>(true);

  const [notifications,setNotifications] = useState<notification[] | []>([])
  const [chats,setChats] = useState<Chat[] | []>([])
  const [socket,setSocket] = useState<Socket | null>(null)
    useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await get();
        setNotifications(res.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();

    const newSocket = io(url);
    setSocket(newSocket);

    newSocket.emit('register', userId);

    newSocket.on('notification', (notification: notification) => {
      setNotifications((prev) => [...prev, notification]);
    });
    newSocket.on("chat",(chat)=>{
      setChats((prev)=>[...prev,chat])
    })
    
    return () => {
      newSocket.close();
    };
  }, [url, userId]);
  
  

  return <NotificationContext.Provider value={{ socket,setSocket,chats,setChats ,loading,setLoading, notifications,setNotifications }}>{children}</NotificationContext.Provider>;
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
