import Navbar from "../Navbar"
import { Outlet } from 'react-router-dom'


const Layout = () => {
  return (
    <>
        <Navbar/>
        
        <div className="container mx-auto px-2 pt-24">
          <Outlet/>
        </div>
    </>
  )
}

export default Layout