import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './Context/UserContext.tsx'
import { RecipeProvider } from './Context/RecipeContext.tsx'
import { NotificationProvider } from './Context/Notification.tsx'
//import { ThemeProvider } from './components/theme-provider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
     <UserProvider>
      <RecipeProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </RecipeProvider>
     </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
