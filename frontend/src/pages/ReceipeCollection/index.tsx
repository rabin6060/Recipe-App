import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CiClock2 } from "react-icons/ci";
import { getAllRecipe } from "@/api/recipe";
import { Skeleton } from "@/components/ui/skeleton";
import { editProfile } from "@/api/user";
import { useUser } from "@/Context/UserContext";
import axios from "axios";
import { toast } from "sonner";

const items = [
  {
    id: "veg",
    label: "Veg",
  },
  {
    id: "vegan",
    label: "Vegan",
  },
  {
    id: "non veg",
    label: "Non Veg",
  }
] as const;

const FormSchema = z.object({
  items: z.array(z.string()),
  ingredients: z.string(),
  title: z.string()
});

const Recipe = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [allRecipes, setAllRecipes] = useState<RecipeData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;
  const [page, setPage] = useState<number>(1);
  const {user,setUser} = useUser()

  const fetchMoreData = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetch(nextPage);
      return nextPage;
    });
  };

  const fetch = async (page: number) => {
    try {
      
      const response = await getAllRecipe(`limit=${limit}&page=${page}`);
      if (!response) {
        setLoading(false);
        return;
      }
      setAllRecipes((prev) =>page===1 ? response.data.data:  [...prev, ...response.data.data])
      setHasMore(response.data.data.length > 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetch(page);
  }, []); // Only run on initial render

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["non veg"],
      ingredients: '',
      title: ''
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const query = new URLSearchParams({
      title: data.title,
      category: data.items.join(','),
      ingredients: data.ingredients
    }).toString();

    try {
      setLoading(true);
      const response = await getAllRecipe(query);
      if (!response) {
        setLoading(false);
        return;
      }
      setAllRecipes(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }
  const handleFavourite =async (id:string)=>{
    const formData = new FormData()
    formData.append('favourite',id)
    try {
      const isFavourite = user?.data?.favourites?.some((favourite) => favourite._id === id);

    const res = await editProfile(user?.data._id, formData);

    localStorage.setItem('user', JSON.stringify(res.data));
    setUser(res.data);

    if (isFavourite) {
      toast.success("Removed from favourites");
    } else {
      toast.success("Added to favourites");
    }
    }  catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        toast.error(error.response.data.message)
      }
     }
    }
  }
   
    return (
        <section className="h-auto rounded-lg">
            <div className="h-full w-full grid grid-cols-4 "  >
                <div className="col-span-1 border dark:border-none rounded-lg shadow-lg p-3">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormLabel className="text-xl dark:text-white">Search By</FormLabel>
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                        
                            <FormItem>
                              <FormLabel className="dark:text-white">Title</FormLabel>
                              <FormControl>
                                <Input placeholder="eg. veg momo" {...field} className="outline-none dark:border-white dark:text-white"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ingredients"
                          render={({ field }) => (
                        
                            <FormItem>
                              <FormLabel className="dark:text-white">Ingredients</FormLabel>
                              <FormControl>
                                <Input placeholder="eg. rice,mutton" {...field} className="outline-none dark:border-white dark:text-white"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="items"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel className="text-base dark:text-white">Diet</FormLabel>
                                <FormDescription className="dark:text-white">
                                  Choose your diet properly!!
                                </FormDescription>
                              </div>
                              {items.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="items"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, item.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== item.id
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal dark:text-white">
                                          {item.label}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Submit</Button>
                      </form>
                    </Form>
                </div>
                <div className="h-[89vh] w-full col-span-3 flex flex-wrap justify-start overflow-y-scroll gap-10 p-2 dark:border-none" id="scrollable">
                  {
                  <InfiniteScroll
                  dataLength={allRecipes && allRecipes.length || 6}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  scrollableTarget='scrollable'
                  loader={<h4 className="text-3xl text-white">Loading...</h4>}
                  endMessage={<p style={{ textAlign: 'center', position:'fixed', bottom:0, paddingLeft:'5px' }}>You have seen it all</p>}
                >
                  <div className="flex flex-wrap gap-9 items-center justify-start">
                    {
                    loading ? 
                    <div className="flex flex-wrap">
                      {
                        Array.from({ length : 6 }, () =>
                        <Skeleton className="w-[300px] h-[380px] rounded-lg" />
                        )
                      }
                      
                    </div>
                    :  (allRecipes && allRecipes?.length>0) ?
                    allRecipes.map(recipe=>(
                        <div key={recipe._id}  className="w-[300px] h-[380px] rounded-md dark:bg-inherit dark:text-white  cursor-pointer shadow-md hover:shadow-lg relative overflow-hidden space-y-2 gap-2">
                          <Link to={`/recipeDetail/${recipe._id}`}>
                           <div className="w-full h-4/5 overflow-hidden cursor-pointer">
                                    <img src={recipe.images[0]} alt="image" className="w-full h-full object-cover rounded-t-md hover:scale-110 transition-all 0.3s ease-linear" />
                            </div>
                          </Link>
                           
                            <div className=" w-auto bg-white p-2 rounded-full absolute top-2 left-2 flex gap-2">
                              <CiClock2 className="text-red-500 text-2xl font-bold" />
                              <span className="dark:text-black">{recipe.cookingPeriod}</span>
                            </div>
                            <div className="flex px-2">
                                <div className="w-full flex items-center justify-between">
                                  <h1 className="text-lg  text-left">{recipe.title.toUpperCase()}</h1>
                                  <FaHeart size={27} type="button" onClick={() => handleFavourite(recipe._id)} className={`hover:text-red-500 hover:scale-[1.05] cursor-pointer z-40 transition-all duration-100 ease-linear ${user?.data?.favourites.some(fav => fav._id === recipe._id) ? 'text-red-500' : ''}`} />
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
             </InfiniteScroll>
                  }
                   
                </div>
                
            </div>
        </section>
    )
}

export default Recipe