
import Layout from '@/components/Layout'
import { Route, Routes } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import Login from './pages/Login'
import Home from '@/pages/Home'
import Recipe from './pages/ReceipeCollection'
import RecipeDetail from './pages/RecipeDetail'
import CreateRecipe from './pages/CreateRecipe'
import Signup from './pages/Signup'
import Verify from './pages/VerfiyPage'
import Profile from './pages/Profile'
import EditRecipe from './pages/EditRecipe'
import { Toaster } from './components/ui/sonner'
import Protected from './components/ProtectedRoute'
import { useEffect } from 'react'
import { get } from './api/notification'
import { useNotification } from './Context/Notification'




function App() {
  // const {notifications,setNotifications} = useNotification()
  // useEffect(()=>{
  //   const fetch = async () =>{
  //     try {
        
  //       const res =await get()
  //       console.log(res && res.data.data)
  //       res && setNotifications(res?.data?.data)
        
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetch()
  // },[])
  // console.log(notifications)
  
  return (
    <div className="dark:bg-black">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Routes>
          <Route path='/' element={<Layout/>}>
            
            <Route path='login' element={<Login/>} />
            <Route path='signup' element={<Signup/>} />
            <Route path='verify/:email' element={<Verify />} />
            <Route path='recipe' element={<Recipe/>} />
            <Route path='recipeDetail/:id' element={<RecipeDetail/>} />
            <Route element={<Protected/>}>
              <Route path='/' element={<Home/>} />
              <Route path='createRecipe' element={<CreateRecipe/>} />
              <Route path='profile' element={<Profile/>} />
              <Route path='editRecipe/:id' element={<EditRecipe/>} />
            </Route>
            
          </Route>
        </Routes>
        <Toaster 
          richColors={true} 
          closeButton 
        />
      </ThemeProvider>
    </div>
      
  )
}

export default App
