import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider, useUser } from './Context/UserContext.tsx'; // Adjust the import path if necessary
import { RecipeProvider } from './Context/RecipeContext.tsx';
import { NotificationProvider } from './Context/Notification.tsx';

const Root: React.FC = () => {
  const { user } = useUser(); 
  const userId = user ? user.data._id : ''; 
  const url = "http://localhost:7000"

  return (
    <NotificationProvider url={url} userId={userId}>
      <App />
    </NotificationProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <RecipeProvider>
          <Root />
        </RecipeProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
