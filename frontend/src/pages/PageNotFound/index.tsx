import { IoMdHome } from "react-icons/io";
import {useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate()
  return (
    <section className="h-screen">
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex items-center">
                <h1 className="text-[150px] font-bold">404</h1>
                <div className="flex flex-col">
                    <span className="text-4xl text-red-500">Page</span>
                    <span className="text-4xl text-red-500">Not</span>
                    <span className="text-4xl text-red-500">Found</span>
                </div>
            </div>
            <div  onClick={()=>navigate('/')} className="bg-slate-100 shadow-sm rounded-lg p-3 flex items-center gap-5 group cursor-pointer hover:shadow-md transition-all duration-200 ease-linear">
                <span className="text-3xl group-hover:scale-[1.03] group-hover:text-blue-500 transition-all duration-200 ease-linear">Back to Home Page</span>
                <IoMdHome className="text-4xl group-hover:scale-[1.07] group-hover:text-blue-500 transition-all duration-200 ease-linear" />
                
            </div>
        </div>
    </section>
  )
}

export default PageNotFound