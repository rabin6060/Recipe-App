import { Avatars } from "@/components/Avatar";
import EmojiInput from "@/components/Emoji";
import { IoMdFlower } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { Progress } from "@/components/ui/progress";
import { useParams } from "react-router-dom";
import { getSingleRecipe } from "@/api/recipe";
import { format } from "date-fns";
import { toast } from "sonner";
import axios from "axios";
import { create, delete_Comment_Rating } from "@/api/comment";
import { useRecipe } from "@/Context/RecipeContext";
import { MdDelete } from "react-icons/md";


const RecipeDetail = () => {
  const [stars, setStars] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [trackRating,setTrackRating] = useState<boolean>(false)
  const [trackComment,setTrackComment] = useState<boolean>(false)
  const [_error,setError] = useState<Error | null>(null)

  const { id } = useParams();
  const {setLoading,setRecipe,recipe} = useRecipe()
  const formData = {...FormData,rating:stars,type:"rating"}
  

  const totalRating =recipe && recipe?.ratings.reduce(
    (total, current) => total + +current.rating,
    0
  );
  
  
  const ratingProgress = [
  { star: 1, number: 0 },
  { star: 2, number: 0 },
  { star: 3, number: 0 },
  { star: 4, number: 0 },
  { star: 5, number: 0 },
  ];
  recipe?.ratings.forEach(({ rating }) => {
    const starIndex = ratingProgress.findIndex((item) => item.star === +rating);
    if (starIndex !== -1) {
      ratingProgress[starIndex].number += 1;
    }
  });
   useEffect(() => {
    if (recipe && recipe.ratings) {
      const total = recipe.ratings.reduce(
        (total, current) => total + +current.rating,
        0
      );
      const avgRating = total / recipe.ratings.length;
      setAverageRating(avgRating);
    }
  }, [recipe]);
 
  const handleStarClick = (index: number) => {
    setStars(index + 1);
  };
  const handleRating = async() => {
    try {
      setTrackRating(false)
      setLoading(true)
      setError(null)
      const response = await create(recipe?._id,formData)
      if (!response) {
        setLoading(false)
      }
      setError(null)
      setLoading(false)
      setTrackRating(true)
      setStars(0)
      toast.success("rating added successfully!!!")
    } catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        setLoading(false)
        setError(error.response.data)
        setTrackRating(false)
        setStars(0)
        toast.error(error.response.data.message,{className:'bg-red-500 text-black'})
      }
     }
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getSingleRecipe(id);
        setRecipe(response.data.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [id,trackRating,trackComment]);

  const handleDeleteComment =async (id:string)=>{
    try {
      setTrackComment(false)
      setError(null)
      const response = await delete_Comment_Rating(recipe?._id,id)
      if (!response) {
        setLoading(false)
      }
      setError(null)
      setTrackComment(true)
      toast.success("comment deleted SuccessFull!!!")
      
    } catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        setError(error.response.data)
        setTrackComment(false)
        toast.error(error.response.data.message)
      }
     }
    }
  }
  
  const handleDeleteRating =async (id:string)=>{
    try {
      setTrackRating(false)
      setError(null)
      const response = await delete_Comment_Rating(recipe?._id,id)
      if (!response) {
        setLoading(false)
      }
      setError(null)
      setTrackRating(true)
      toast.success("rating deleted SuccessFull!!!")
      
    } catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        setError(error.response.data)
        setTrackRating(false)
        toast.error(error.response.data.message)
      }
     }
    }
  }
  return (
    <section className=" rounded-lg pt-2 mt-2 pb-10">
      <div className="w-full h-full space-y-10">
        {/* image section*/}
        <div className=" grid grid-cols-2 gap-2 mb-2">
          <div className="col-span-1 w-full h-[500px] rounded-lg overflow-hidden">
            <img
              src={recipe && recipe?.images[0]}
              alt="image"
              className="object-cover h-full w-full rounded-lg hover:scale-[1.03] duration-200 ease-linear cursor-pointer"
            />
          </div>
          <div className="grid grid-cols-2 col-span-1 h-[500px] gap-2">
            {recipe?.images.slice(1).map((image, index) => (
              <div key={index} className="col-span-1 h-full rounded-lg overflow-hidden ">
                <img
                  src={image}
                  alt="image"
                  className="object-cover w-full h-full rounded-lg hover:scale-[1.03] duration-200 ease-linear cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
        {/* ingridients section*/}
        <div className=" grid grid-cols-3 gap-2">
          <div className="space-y-3 h-1/2 rounded-lg col-span-1 cursor-pointer">
            <h3 className="text-2xl dark:text-white">MOMO</h3>
            <div className="w-full shadow-sm hover:shadow-md  duration-200 ease-linear  p-2">
              <h4 className="text-xl mb-2 dark:text-white">Ingredients</h4>
              {recipe?.ingredients.map((ingredient, index) => (
                <div className="flex gap-1" key={index}>
                  <IoMdFlower className="rotate-90 text-xl text-red-500" />
                  <p className="text-sm text-slate-500"> {ingredient}</p>
                </div>
              ))}
            </div>
            <div className="w-full shadow-sm hover:shadow-md  duration-200 ease-linear  p-2">
              <h4 className="text-lg dark:text-white">Category</h4>
              
              <div className="flex gap-1 items-center">
                  <IoMdFlower className="rotate-90 text-xl text-red-500" />
                  <p className="text-sm text-slate-500"> {recipe?.categories}</p>
                </div>
            </div>
          </div>
          {/* steps section*/}
          <div className="col-span-2 dark:bg-inherit cursor-pointer rounded-lg p-2 overflow-y-auto">
            <h2 className="text-3xl mb-5 dark:text-white">
              Follow these Steps
            </h2>
            <div className="space-y-4">
              {recipe?.instructions.map((step, index) => (
                <div key={index} className="space-y-1">
                  <h3 className="text-xl dark:text-white capitalize">{step.step}</h3>
                  {step.substep.map((substep, subIndex) => (
                    <div
                      key={subIndex}
                      className=" p-2 w-full shadow-sm hover:shadow-md  duration-200 ease-linear dark:bg-inherit"
                    >
                      <h4 className="text-md font-[300] dark:text-white capitalize">
                        {substep.title}
                      </h4>
                      <div className="flex gap-1 items-center space-y-1">
                        <IoMdFlower className=" text-red-500 text-xl" />
                        <p className="text-sm text-slate-500">
                          {" "}
                          {substep.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* video section*/}
        <div className="h-[500px] mt-10">
          <h3 className="text-3xl mb-10 dark:text-white">Watch Video</h3>
          <div className="h-[90%] w-full mx-auto bg-inherit">
            <iframe
              width="100%"
              height="100%"
              src={recipe?.video}
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        {/* rating and comment section*/}
        <div className=" grid grid-cols-2 gap-2 dark:text-white">
          <div className="col-span-1 h-auto rounded-lg p-2 space-y-5">
            <div className="h-auto shadow-sm p-1 space-y-3">
              <h3 className="text-3xl ">Overall Ratings</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-1 shadow-sm hover:shadow-md transition-all duration-200 ease-linear cursor-pointer  dark:bg-inherit w-[80%] py-2 px-5 rounded-full">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      size={40}
                      className={`cursor-pointer ${
                        index < averageRating ? "text-yellow-500" : ""
                      }`}
                    />
                  ))}
                  <span className="text-slate-600">
                    {Math.ceil(averageRating) || 0} out of 5
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {ratingProgress.map((rating) => (
                    <div className="flex items-center gap-3" key={rating.star}>
                      <span className="text-lg text-slate-500">
                        {rating.star} star
                      </span>
                      <Progress value={rating.number} className="w-[40%]" />
                      <span className="text-lg text-slate-500">
                        {totalRating && Math.round((rating.number / totalRating) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <h3 className="text-2xl">Rate Out of Five</h3>
            <div className="w-[65%] flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 ease-linear cursor-pointer rounded-full dark:bg-black p-2">
              <div className="flex items-center justify-between dark:bg-inherit w-[95%] py-2 px-5 rounded-full">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    size={30}
                    className={`cursor-pointer dark:bg-inherit ${
                      index < stars ? "text-yellow-500" : "dark:text-slate-100"
                    }`}
                    onClick={() => handleStarClick(index)}
                  />
                ))}
              </div>
              <IoSend
                fontSize={50}
                className="text-blue-500 cursor-pointer mx-2"
                onClick={handleRating}
              />
            </div>
            <div className="h-[30vh] w-[63.6%] overflow-y-auto space-y-4">
              {recipe?.ratings.map((rating) => (
                <div key={rating._id} className=" p-2 flex items-center gap-5 cursor-pointer rounded-lg shadow-sm hover:shadow-md  duration-200 ease-linear dark:bg-inherit">
                  <Avatars />
                  <div className="w-[90%] flex flex-col gap-1">
                    <h4 className="text-lg">
                      {rating.user}
                    </h4>
                     
                    <div className="flex">
                      {[...Array(+rating.rating)].map((_, index) => (
                        <FaStar
                          key={index}
                          size={20}
                          className={`cursor-pointer text-yellow-500`}
                          onClick={() => handleStarClick(index)}
                        />
                      ))}
                    </div>
                    <span className="text-slate-500 text-xs">{format(new Date(rating?.createdAt), 'MMMM d, yyyy h:mm a')}</span>
                  </div>
                  <div>
                      <MdDelete size={25} className="text-red-500" onClick={()=>handleDeleteRating(rating._id)} />
                    </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 rounded-lg flex flex-col gap-2 pt-4 dark:text-white">
            <h3 className="text-2xl">Add a Comment</h3>
            <EmojiInput recipeId={recipe && recipe?._id} setTrackComment={setTrackComment}/>
            <div className="w-full h-[90%] rounded-lg p-2 space-y-2 overflow-y-auto">
              <h2 className="text-lg">All Comments</h2>
              {
                recipe?.comments.map(comment=>(
                <div className=" p-2 flex items-center dark:border gap-5 cursor-pointer rounded-lg shadow-sm hover:shadow-md  duration-200 ease-linear dark:bg-inherit space-y-1" key={comment?._id}>
                    <Avatars />
                    <div className="w-[90%] flex flex-col">
                      <div className="flex flex-col">
                        <h4 className="text-lg">
                        {comment.user} 
                        </h4>
                        <span className="text-slate-500 text-[12px]">{format(new Date(comment?.createdAt), 'MMMM d, yyyy h:mm a')}</span>
                      </div>
                      <p className="text-sm">
                        {comment.content}
                      </p>
                    </div>
                    <div>
                      <MdDelete size={25} className="text-red-500" onClick={()=>handleDeleteComment(comment._id)} />
                    </div>
                </div>
                ))
              }
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipeDetail;
