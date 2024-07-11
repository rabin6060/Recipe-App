import { IoMdHome } from "react-icons/io";
import {useNavigate } from "react-router-dom";
import Pagenot from "../../assets/pagenotfound.json"
import Lottie from "lottie-react";

const PageNotFound = () => {
    const navigate = useNavigate()
  return (
    <section className="h-full">
        <div className="w-full h-full flex flex-col items-center justify-center">
            <Lottie animationData={Pagenot} className="h-[60vh] w-full" />
            <div  onClick={()=>navigate('/')} className="bg-slate-100 shadow-sm rounded-lg p-3 flex items-center gap-5 group cursor-pointer hover:shadow-md transition-all duration-200 ease-linear">
                <span className="text-3xl group-hover:scale-[1.03] group-hover:text-blue-500 transition-all duration-200 ease-linear">Go Back</span>
                <IoMdHome className="text-4xl group-hover:scale-[1.07] group-hover:text-blue-500 transition-all duration-200 ease-linear" />
                
            </div>
        </div>
    </section>
  )
}

export default PageNotFound