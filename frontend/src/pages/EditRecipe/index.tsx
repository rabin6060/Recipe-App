import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getSingleRecipe, updateRecipe } from "@/api/recipe";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ImCross } from "react-icons/im";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";




const substepSchema = z.object({
  title: z.string().min(1, { message: "can't be empty" }),
  desc: z.string().min(1, { message: "can't be empty" }),
});

const stepSchema = z.object({
  step: z.string().min(1, { message: "can't be empty" }),
  substep: z.array(substepSchema).min(1, { message: "can't be empty" }),
});

const formSchema = z.object({
  title: z.string().min(2, { message: "title must be at least 2 characters." }),
  desc: z.string().min(5, { message: "desc must be added." }),
  ingredients: z.string().array().min(1, { message: "can't be empty" }),
  categories: z.string().min(1, { message: "can't be empty" }),
  cookingPeriod: z.string().min(1, { message: "can't be empty" }),
  instructions: z.array(stepSchema),
  images: z.array(z.instanceof(File)),
  videos: z.array(z.instanceof(File))
});

const editRecipe = () => {
    const [recipeEdit,setRecipeEdit] = useState<RecipeData>()
    const {id} = useParams()
    
    const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: recipeEdit?.title || "",
      desc: recipeEdit?.desc || "",
      ingredients: recipeEdit?.ingredients || [],
      categories: recipeEdit?.categories || "",
      cookingPeriod: recipeEdit?.cookingPeriod || "",
      instructions: recipeEdit?.instructions || [],
      images: [] as File[],
      videos: [] as File[],
    },
  });
  
  const [loading,setLoading] = useState<boolean>(false)
  const [_error,setError] = useState<boolean | null>(null)
 // const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<string>('');
  const [instructions, setInstructions] = useState<{ step: string; substep: { title: string; desc: string }[] }[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [currentSubstep, setCurrentSubstep] = useState<{ title: string; desc: string }>({ title: '', desc: '' });
  const navigate = useNavigate()
  const handleImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filesArray = Array.from(event.target.files || []);
    methods.setValue('images', filesArray);
  };

  const handleVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filesArray = Array.from(event.target.files || []);
    methods.setValue('videos', filesArray);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, action: string) => {
    if (action === 'ingredient') {
      setCurrentIngredient(event.target.value);
    }else if (action === 'step') {
      setCurrentStep(event.target.value);
    } else if (action === 'substepTitle') {
      setCurrentSubstep({ ...currentSubstep, title: event.target.value });
    } else if (action === 'substepDesc') {
      setCurrentSubstep({ ...currentSubstep, desc: event.target.value });
    }
  };
  
  const handleAdd = (action: string) => {
    if (action === 'ingredient' && currentIngredient.trim() !== '') {
      const newIngredients =recipeEdit && [...recipeEdit.ingredients, currentIngredient.trim()];
      newIngredients?.map(ingredients=>{
        setCurrentIngredient("")
        if (!recipeEdit?.ingredients.includes(ingredients)) {
          recipeEdit?.ingredients.push(ingredients)
        }
      })
      newIngredients && methods.setValue('ingredients', newIngredients);
      console.log(recipeEdit)
    }  else if (action === 'substep' && currentSubstep.title.trim() !== '' && currentSubstep.desc.trim() !== '') {
    const updatedInstructions = [...(recipeEdit?.instructions || [])];
    const lastStepIndex = updatedInstructions.length - 1;
    if (lastStepIndex >= 0) {
      updatedInstructions[lastStepIndex].substep.push(currentSubstep);
      setRecipeEdit(prev => prev ? { ...prev, instructions: updatedInstructions } : prev);
      setInstructions(updatedInstructions);
      setCurrentSubstep({ title: '', desc: '' });
      methods.setValue('instructions', updatedInstructions);
    } else {
      toast.error('Please add a step before adding substeps');
    }
  } else if (action === 'step' && currentStep.trim() !== '') {
    const newInstructions = [...(recipeEdit?.instructions || []), { step: currentStep.trim(), substep: [] }];
    setRecipeEdit(prev => prev ? { ...prev, instructions: newInstructions } : prev);
    setInstructions(newInstructions);
    setCurrentStep('');
    methods.setValue('instructions', newInstructions);
  }
  };
  

  const remove = (item: string, action: string) => {
    if (action === 'ingredient') {
      const newIngredients = recipeEdit && recipeEdit.ingredients.filter(ing => ing !== item);
  
      setRecipeEdit(prev => ({
        ...prev!,
        ingredients: newIngredients!
      }));
      newIngredients && methods.setValue('ingredients', newIngredients);
      
    } else if (action === 'instruction') {
    const newInstructions = instructions.filter((_, insIndex) => insIndex !== +item);
    setInstructions(newInstructions);
    setRecipeEdit(prev => prev ? { ...prev, instructions: newInstructions } : prev);
    methods.setValue('instructions', newInstructions);
  }
  };

  const onSubmit = async (values: any) => {
    values.instructions = instructions;
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('desc', values.desc);
    formData.append('cookingPeriod', values.cookingPeriod);
    recipeEdit?.ingredients.forEach((ingredient: string) => formData.append('ingredients[]', ingredient));
    formData.append('categories', values.categories);
    values.images.forEach((image: File) => formData.append('images', image));
    values.videos.forEach((video: File) => formData.append('videos', video));
    
    values.instructions.forEach((instruction: any, index: number) => {
    formData.append(`instructions[${index}][step]`, instruction.step);
    instruction.substep.forEach((sub: any, subIndex: number) => {
      formData.append(`instructions[${index}][substep][${subIndex}][title]`, sub.title);
      formData.append(`instructions[${index}][substep][${subIndex}][desc]`, sub.desc);
    });
    });
    
    try {
      setLoading(true)
      setError(null)
      const response =recipeEdit && await updateRecipe(recipeEdit?._id,formData)
      if (!response) {
        setLoading(false)
        toast.error("sorry recipe updation failed",{className:'bg-red-500 text-black'})
      }
      
      setError(null)
      setLoading(false)
      toast.success("recipe updated SuccessFull!!!")
      navigate('/')
    } catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        setLoading(false)
        setError(error.response.data)
        toast.error("internal server error!!!",{className:'bg-red-500 text-black'})
      }
     }
    }
  };
  useEffect(()=>{
    const fetch = async () => {
      try {
        const res = await getSingleRecipe(id)
        setRecipeEdit(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetch()
  },[])
   useEffect(() => {
    if (recipeEdit) {
      methods.reset({
        title: recipeEdit.title,
        desc: recipeEdit.desc,
        ingredients: recipeEdit.ingredients,
        categories: recipeEdit.categories,
        cookingPeriod: recipeEdit.cookingPeriod,
        instructions: recipeEdit.instructions,
        images: [],
        videos: [],
      });
    }
  }, [recipeEdit, methods]);
  return (
    <section className="h-auto">
      <div className="w-[70%] mx-auto overflow-y-auto rounded-lg pr-2">
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4 pb-5 dark:text-white">
            <FormField
              control={methods.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desc</FormLabel>
                  <FormControl>
                    <Textarea placeholder="desc" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="cookingPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CookingTime</FormLabel>
                  <FormControl>
                    <Input placeholder="eg: 35 min" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="images"
              render={() => (
                <FormItem className="flex flex-col ">
                  <FormLabel>Upload Images</FormLabel>
                  <div className="flex gap-4">
                    <FormControl>
                      <Input type="file" name="image" multiple accept="image/*" title="Upload Image" placeholder="add images" onChange={handleImages} />
                    </FormControl>
                    
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="videos"
              render={() => (
                <FormItem className="flex flex-col ">
                  <FormLabel>Upload Video</FormLabel>
                  <div className="flex gap-4">
                    <FormControl>
                      <Input type="file" accept="video/*" title="Upload video" placeholder="add video" onChange={handleVideo} />
                    </FormControl>
                    
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="instructions"
              render={() => (
                <FormItem className="space-y-5">
                  <FormLabel className="text-lg flex">Add Instruction</FormLabel>
                  <label>You have to add step first for one instruction.</label>
                  <div className="flex flex-col gap-3">
                    <Label>Add Step</Label>
                    <Input type="text" placeholder='instruction' value={currentStep} onChange={(e) => handleChange(e, 'step')} />
                    <Button type="button" variant={"outline"} className='hover:shadow-md' onClick={() => handleAdd('step')}>Add Step</Button>
                  </div>
                  <div className="flex flex-col gap-5 items-start">
                    <Label>Add SubStep</Label>
                    <Input type="text" placeholder='title' value={currentSubstep.title} onChange={(e) => handleChange(e, 'substepTitle')} />
                    <Input type="text" placeholder='desc' value={currentSubstep.desc} onChange={(e) => handleChange(e, 'substepDesc')} />
                    <Button type="button" variant={"outline"} className='hover:shadow-md w-full ' onClick={() => handleAdd('substep')}>
                      Add SubStep
                    </Button>
                  </div>
                  {recipeEdit && recipeEdit.instructions.length > 0 ? (
                    <div className="space-y-2 ">
                      {recipeEdit.instructions.map((instruction, index) => (
                        <div key={index} className='flex flex-col shadow-sm border rounded-lg p-2 relative'>
                          <div className="text-lg font-semibold">Step: <span className="font-normal">{instruction.step}</span></div>
                          <ImCross className="text-2xl text-red-500 absolute top-2 right-2 cursor-pointer pl-2"
                          onClick={() => remove((index.toString()), 'instruction')}/>
                          <div>
                            
                            {instruction.substep.map((sub, subIndex) => (
                              <div key={subIndex} className="w-full flex flex-col ">
                                <span className="text-lg font-semibold">Substep</span>
                                <p>Title: {sub.title}</p>
                                <p>Desc: {sub.desc}</p>
                              </div>
                            ))}
                          </div>
                          
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">
                      no instruction yet
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="ingredients"
              render={() => (
                <FormItem className="space-y-5">
                  <FormLabel className=" text-lg flex">Ingredients</FormLabel>
                  <div className="flex gap-5 items-center">
                    <Input type="text" placeholder='add one ingredient at a time' value={currentIngredient} onChange={(e) => handleChange(e, 'ingredient')} />
                    
                    <Button type="button" variant={"outline"} className='hover:shadow-md' onClick={() => handleAdd('ingredient')}>
                      Add Ingredient
                    </Button>
                  </div>
                  {recipeEdit && recipeEdit?.ingredients.length > 0 ? (
                    <div className="inline-flex flex-col gap-1">
                      {recipeEdit.ingredients.map((ingredient, index) => (
                        <div key={index} className='w-auto bg-slate-100 shadow-md flex justify-between px-2 py-1 rounded-full cursor-pointer mr-2 dark:bg-inherit dark:border' onClick={() => remove(ingredient, 'ingredient')}>
                         {ingredient} <span className='text-red-500 '>x</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">
                      no ingredient
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="categories"
              render={() => (
                <FormItem className="flex items-center gap-5">
                  <FormLabel className="text-lg flex">Categories</FormLabel>
                  <Controller
                    name="categories"
                    control={methods.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a diet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Diets</SelectLabel>
                            <SelectItem value="veg">Veg</SelectItem>
                            <SelectItem value="nonveg">Non Veg</SelectItem>
                            <SelectItem value="vegan">Vegan</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} variant={'outline'} className={`w-full`}>{!loading ? 'Update':'Updating...'}</Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default editRecipe;
