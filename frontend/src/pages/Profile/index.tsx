import { editProfile } from "@/api/user"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useUser } from "@/Context/UserContext"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const schema = z.object({
  username: z.string().min(3,"Username must contain at least 3 characters"),
  profilePic:z.array(z.instanceof(File)).min(1, { message: "can't be empty" }),
});
const Profile = () => {
  const [_error,setError] = useState<Error | null>(null)
  const [loading,setLoading] = useState<boolean>(false)
  const {user,setUser} = useUser()
  const [edit,setEdit] = useState<boolean>(false)
  
  const userId = user?.data._id
  const form = useForm(
    {
    defaultValues: {
      username: user?.data.username,
      profilePic:[]
    },
    resolver:zodResolver(schema)
  }
  )
   const handleProfilePic = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filesArray:any = Array.from(event.target.files || []);
    form.setValue('profilePic', filesArray);
  };

  async function onSubmit(values:any) {
    
    const formData = new FormData();
    formData.append('username',values.username)
    
    values.profilePic.forEach((image: File) => formData.append('profilePic', image));
    try {
      setLoading(true)
      setError(null)
      const response = await editProfile(userId,formData)
      console.log(response.data)
      if (!response) {
        setLoading(false)
      }
      setError(null)
      setLoading(false)
      localStorage.setItem('user',JSON.stringify(response.data))
      setUser(response.data)
      toast.success("User Updated SuccessFully")
      
      setEdit(false)
    } catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        setLoading(false)
        setError(error.response.data)
        toast("update failed!!!")
      }
     }
    }
  }
  
  return (
    <section className="h-auto">
      <div className="sm:max-w-[60%] mx-auto ">
        {
          !edit ? 
          <div className="py-10 flex flex-col gap-6 items-center justify-center">
            <h3 className="text-center text-2xl">User Profile</h3>
            <div className="w-[100px] h-[100px] rounded-full bg-red-100 overflow-hidden cursor-pointer">
              <img src={user?.data.profilePic} alt="profile" className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <h3>Username: <span className="text-sm capitalize">{user?.data.username}</span></h3>
              <h3>Email: <span className="text-sm">{user?.data.email}</span></h3>
            </div>
            <Button onClick={()=>setEdit(true)}>Edit Profile</Button>
          </div>
        :
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-5">
                      <FormLabel className=" text-lg">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} value={form.getValues('username')} />
                      </FormControl>
                     
                    </FormItem>
                  )}
                />
               
                <FormField
                  control={form.control}
                  name="profilePic"
                  render={() => (
                    <FormItem className="space-y-5">
                      <FormLabel className=" text-lg">Upload ProfilePic</FormLabel>
                      <FormControl>
                        <Input type="file" name="profilePic" accept="image/*" title="Upload Image" placeholder="add profile" onChange={handleProfilePic} />
                      </FormControl>
                      
                    </FormItem>
                  )}
                />

                <div className="w-full flex items-center justify-center">
                    <Button type="submit" className="w-full bg-teal-500 hover:bg-purple-500">{!loading?'Update':'Updating....'}</Button>
                </div>
               
              </form>
            </Form>
            <Button variant={"destructive"} className="w-full mt-2" onClick={()=>setEdit(false)}>Cancel</Button>
          </div>
        }
        
      </div>
    </section>
  )
}

export default Profile