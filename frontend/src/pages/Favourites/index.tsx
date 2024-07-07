import { editProfile } from "@/api/user"
import { useUser } from "@/Context/UserContext"
import axios from "axios"
import { CiClock2 } from "react-icons/ci"
import { FaHeart } from "react-icons/fa"
import { Link } from "react-router-dom"
import { toast } from "sonner"


const Favourites = () => {
    const {user,setUser} = useUser()
    console.log(user?.data.favourites.length)
    const handleFavourite =async (id:string)=>{
    const formData = new FormData()
    formData.append('favourite',id)
    try {
      const res = await editProfile(user?.data._id,formData)
      localStorage.setItem('user',JSON.stringify(res.data))
      setUser(res.data)
      toast.success("removed from favourites")
    }  catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        toast.error(error.response.data.message)
      }
     }
    }
  }
  return (
    <section className="h-auto">
        <div className="w-full h-full flex gap-10 flex-wrap">
            {(user && user.data.favourites?.length>0) ?
                    user.data.favourites.map(recipe=>(
                        <div key={recipe._id}  className="w-[300px] h-[380px] rounded-md dark:bg-inherit dark:text-white  cursor-pointer shadow-md hover:shadow-lg relative overflow-hidden space-y-2 gap-2">
                          <Link to={`/recipeDetail/${recipe._id}`}>
                           <div className="w-full h-4/5 overflow-hidden cursor-pointer">
                                    <img src={ recipe.images[0]} alt="image" className="w-full h-full object-cover rounded-t-md hover:scale-110 transition-all 0.3s ease-linear" />
                            </div>
                          </Link>
                           
                            <div className=" w-auto bg-white p-2 rounded-full absolute top-2 left-2 flex gap-2">
                              <CiClock2 className="text-red-500 text-2xl font-bold" />
                              <span className="dark:text-black">{recipe.cookingPeriod}</span>
                            </div>
                            <div className="flex px-2">
                                <div className="w-full flex items-center justify-between">
                                  <h1 className="text-lg  text-left">{recipe.title.toUpperCase()}</h1>
                                  <FaHeart size={27} type="button" onClick={()=>handleFavourite(recipe._id)} className={` text-red-500 hover:scale-[1.03] cursor-pointer z-40 transition-all duration-100 ease-linear` }/>
                                </div>
                            </div>
                            <h3 className="px-2 text-md">Recipe by Chef {recipe?.userId?.username} </h3>
                            
                        </div>))
                        :
                        <div>
                          No result found.
                        </div>
}
        </div>
    </section>
  )
}

export default Favourites