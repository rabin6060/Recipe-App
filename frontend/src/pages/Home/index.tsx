import { deleteRecipe, getRecipeUser } from "@/api/recipe";
import { useUser } from "@/Context/UserContext";
import { useEffect, useState } from "react";
import {format} from "date-fns";
import { AiOutlineComment } from "react-icons/ai";
import { Skeleton } from "@/components/ui/skeleton"
import { Link, useNavigate } from "react-router-dom";
import { useRecipe } from "@/Context/RecipeContext";
import { RxDotsHorizontal } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { MdPersonAddAlt1 } from "react-icons/md";
import { BsPersonCheckFill } from "react-icons/bs";
import { editProfile } from "@/api/user";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import { io } from 'socket.io-client'
import { notification, useNotification } from "@/Context/Notification";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AllUserInfo } from "../Login/type";



const Home = () => {
  const navigate = useNavigate()
  const {user,users,setUser} = useUser()
  const userId = user && user.data._id
  const [show,setShow] = useState<boolean>(false)
  const [isDeleted,setDeleted] = useState<boolean>(false)
  const [trackRecipe,setTrackRecipe] = useState<string>("")
  const [notification,setNotification] = useState<notification[]>([])
  const {setNotifications,setSocket} = useNotification()
  setNotifications(notification)
  let friendsAndMe:string[] = []
  
  const {recipes,setRecipes} = useRecipe()
  const verifiedUsers:AllUserInfo["data"] | [] =users &&  users?.data.filter(user=>!('pin' in user)) || []
  console.log(verifiedUsers)
  const handleDelete = async (id:string) => {
    setDeleted(false)
    try {
      await deleteRecipe(id)
      setShow(false)
      setDeleted(true)
      toast.success("deletion successfully")
    } catch (error) {
      toast.error("sorry deletion failed")
      setDeleted(false)
    }
  }
  const handlefollow = async(id:string) =>{
    const formData = new FormData()
    formData.append('friend',id)
    try {
      const res = await editProfile(user?.data._id,formData)
      localStorage.setItem('user',JSON.stringify(res.data))
      setUser(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  const handleShow = (id:string,recipeId:string) => {
      setTrackRecipe(recipeId)
      user?.data._id===id ? setShow(prev=>!prev) : toast.error("you are not authorized user to preform action on this post")
  }
  useEffect(()=>{
      if (userId) {
        const fetch = async() => {
        try {
           const responses =await Promise.all(user?.data.friends && [...friendsAndMe,userId,...user?.data?.friends].map(id=>getRecipeUser(id)))
           const allRecipes = responses.flatMap(response => response?.data.data);
           setRecipes(allRecipes)
        } catch (error) {
          console.log(error)
        }
        }

      fetch()
      }
  },[userId,isDeleted,user])

  useEffect(() => {
    const newSocket = io('http://localhost:7000'); 
    setSocket(newSocket);
    newSocket.emit('register', userId);
    newSocket.on('notification', (notification) => {
      setNotification((prev) => {
        return [...prev , notification]
      })
      });
  
    return () => {
      newSocket.close();
    };
  }, [setNotification]);
  return (
    <section className="h-auto">
      <div className="flex h-full gap-5">
        {/* Sidebar */}
        <div className="w-1/5 h-1/2 rounded-lg p-2 space-y-2">
          <h3 className="text-xl text-slate-500">Follow Friends</h3>
          <div className="flex flex-col gap-3">
            {verifiedUsers && verifiedUsers?.filter(u=>u?._id!==user?.data?._id).map((friend, index) => (
               <div key={index} className={`flex items-center justify-between border-b rounded-md cursor-pointer gap-2 p-1   ${!user?.data.friends.includes(friend._id) ? 'flex':'hidden'}`}>
                <div className="flex items-center gap-2 p-1">
                  <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                      <img src={friend?.profilePic} alt="profile" className="w-full h-full object-cover"/>
                  </div>
                  <span>{friend.username}</span>
                </div>
                {
                  !user?.data.friends.includes(friend._id) ? 
                     <div className="flex gap-1 items-center border p-1 rounded-lg hover:scale-[1.06] transition-all duration-200 ease-linear" onClick={()=>handlefollow(friend._id)}>
                      <span className="text-blue-500">Follow</span>
                      <MdPersonAddAlt1 size={28} className="text-blue-500  " />
                     </div>
                   
                   :
                   <BsPersonCheckFill size={28} className="text-blue-500 hover:scale-[1.08] transition-all duration-200 ease-linear " />
                }
               
                
              </div>
            ))}
          </div>
        </div>

        {/* Posts Section (Scrollable) */}
        <div className="w-1/2 rounded-lg pr-2">
          <div className="h-[88vh] p-2 space-y-6 overflow-y-auto">
            {
              !(user && recipes)?
              <div className="space-y-5">
                <div className="flex gap-5 border p-2 rounded-lg items-center">
                <Skeleton className="h-[40px] w-[40px] rounded-full" />
                <Skeleton className="h-10 w-[300px]" />
                </div>
                
                  
                <div className="h-[500px] overflow-hidden border p-2">
                  <div className="flex mb-2">
                    <Skeleton className="h-[40px] w-[40px] rounded-full" />
                  <div className="flex flex-col gap-2 mt-2 ml-2">
                    <Skeleton className="h-2 w-[200px]" />
                    <Skeleton className="h-2 w-[200px]" />
                  </div>
                  </div>
                  <Skeleton className="h-[90%] w-full rounded-lg" />
                </div>
                <div className="h-[500px] overflow-hidden border p-2">
                  <div className="flex mb-2">
                    <Skeleton className="h-[40px] w-[40px] rounded-full" />
                  <div className="flex flex-col gap-2 mt-2 ml-2">
                    <Skeleton className="h-2 w-[200px]" />
                    <Skeleton className="h-2 w-[200px]" />
                  </div>
                  </div>
                  <Skeleton className="h-[90%] w-full rounded-lg" />
                </div>
              </div>
              
              :
              <>
              <div className="h-auto p-2 shadow-md border bg-white dark:bg-inherit dark:border rounded-lg flex items-center gap-5">
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                      <img src={user?.data.profilePic} alt="profile" className="w-full h-full object-cover"/>
                </div>
              <div className="rounded-2xl w-full p-2 bg-slate-50 dark:bg-inherit">
                <h3 className="cursor-pointer text-slate-500" onClick={()=>navigate('/createRecipe')}>What's on your mind, {user?.data.username}?</h3>
              </div>
            </div>
            <div className="flex flex-col gap-3 dark:bg-inherit">
              {recipes && recipes?.map((recipe) => (
                
                <div key={recipe._id} className="p-2 border shadow-md rounded-lg bg-white dark:bg-inherit mb-2 space-y-3">
                  <div className="flex items-center gap-3 relative">
                   
                    <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                      <img src={recipe.userId?.profilePic} alt="profile" className="w-full h-full object-cover"/>
                    </div>
                    
                    <div className="flex flex-col">
                      <h3 className="text-lg font-[400] dark:text-white">{recipe.userId?.username}</h3>
                      <span className="text-xs text-slate-500">{format(new Date(recipe?.createdAt), 'MMMM d, yyyy h:mm a')}</span>
                    </div>
                    <RxDotsHorizontal className="absolute right-5 top-0 hover:scale-[1.07] transition-all duration-200 ease-linear cursor-pointer" size={25}
                     onClick={()=>recipe.userId?._id && handleShow(recipe.userId?._id,recipe._id)} />
                   
                    <div className={`absolute top-7 right-0 w-[150px] bg-slate-50 py-3 px-2 rounded-lg hover:shadow-md ${show && trackRecipe===recipe._id ? 'flex flex-col gap-1':'hidden'}`}>
              
                      <Link to={`editRecipe/${recipe._id}`} onClick={() => setShow((prev) => !prev)} className="cursor-pointer hover:scale-[1.03] transition-all duration-300 ease-linear flex items-center justify-between">Edit <FaEdit size={18} className="text-teal-500" /></Link>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <div  className="cursor-pointer hover:scale-[1.03] transition-all duration-300 ease-linear flex items-center justify-between">Delete <MdDelete size={20} className="text-red-500"/></div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your recipe.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={()=>handleDelete(recipe._id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="py-2">
                    {recipe.desc}
                  </div>
                  
                  <Link to={`recipeDetail/${recipe._id}`} className="w-full h-full overflow-hidden">
                    <img src={recipe.images && recipe.images[0]} className="w-full h-full object-cover" alt="images" />
                 
                 
                  <div className="w-full">
                    <div className="border-b-2 text-xs flex justify-end cursor-pointer text-slate-500 pb-2 underline">{recipe.comments.length} comments</div>
                    <div className="flex items-center justify-between text-slate-500 p-2">
                      <div className="flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-all duration-200 ease-linear"><AiOutlineComment className="text-xl" /> <span>Comment</span></div>
                      <div className="cursor-pointer hover:scale-105 transition-all duration-200 ease-linear">View</div>
                    </div>
                  </div>
                   </Link>
                </div>
               
                
              ))}
            </div>
              </>
            }
            
          </div>
        </div>
        <div className="w-1/4 h-1/2 rounded-lg p-2 space-y-2">
          <h3 className="text-xl text-slate-500">Following Friends</h3>
          <div className="flex flex-col gap-2">
            {users?.data.map((friend, index) => (
              <div key={index} className={`flex items-center justify-between border-b p-2 rounded-md cursor-pointer gap-2 p   ${user?.data.friends.includes(friend._id) ? 'flex':'hidden'}`}>
                <div className="flex items-center gap-2">
                 <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                      <img src={friend.profilePic} alt="profile" className="w-full h-full object-cover"/>
                </div>
                <span>{ friend.username}</span>
                </div>
               
                {
                  !user?.data.friends.includes(friend._id) ? 
                   <MdPersonAddAlt1 size={28} className="text-blue-500 hover:scale-[1.08] transition-all duration-200 ease-linear " />
                   :
                   <div className="flex gap-1 items-center border p-1 rounded-lg hover:scale-[1.06] transition-all duration-200 ease-linear" onClick={()=>handlefollow(friend._id)}>
                      <span className="text-blue-500">Unfollow</span>
                      <BsPersonCheckFill size={28} className="text-blue-500  " />
                     </div>
                }
              </div>

            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home
