import { useForm } from "react-hook-form"
//import {login} from '../../api/user'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "@/Context/UserContext"
import SingUpAnimation from '../../assets/signup.json'
import Lottie from 'lottie-react'
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { login } from "@/api/user"


interface Error{
    message:string,
    status:string
}
const schema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").nonempty("Password is required"),
});


const Login = () => {
  const form = useForm(
    {
    defaultValues: {
      email: "",
      password: "",
    },
    resolver:zodResolver(schema)
  }
  )
  const navigate = useNavigate()
 
  const [_error,setError] = useState<Error | null>(null)
  const [loading,setLoading] = useState<boolean>(false)
  const {user,setUser} = useUser()
  console.log(user)
 
  async function onSubmit(values:any) {
    try {
      setLoading(true)
      setError(null)
      const response = await login(values)
      if (response.status===401) {
        setLoading(false)
        toast.error("Invalid Email or Password Login Failed!!!")
      }
      localStorage.setItem('user',JSON.stringify(response))
      response && setUser(response)
      setError(null)
      setLoading(false)
      toast.success("user logged in SuccessFull!!!")
      navigate('/')
    } catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        setLoading(false)
        setError(error.response.data)
        toast.error(error.response.data.message)
      }
     }
    }
  }

  
  return (
    <section className="h-auto flex items-center justify-center mt-20">
      <div className="w-full sm:max-w-[60%] mx-auto rounded-lg flex items-center justify-center py-20">
        <div className="w-1/2">
           <Lottie animationData={SingUpAnimation} />
        </div>
        <div className="w-1/2">
         <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full sm:max-w-[60%]">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-5">
                      <FormLabel className=" text-lg">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-5">
                      <FormLabel className=" text-lg">Password</FormLabel>
                      <FormControl>
                        <Input placeholder="password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full flex items-center justify-center">
                    <Button type="submit" className="w-full bg-teal-500 hover:bg-purple-500">{!loading?'Login':'Processing....'}</Button>
                </div>
                <div>
                  <p>Don't have a Account? <Link to={'/signup'} className="text-teal-500 text-xl underline"> Register</Link></p>
                </div>
              </form>
            </Form>
        </div>

      </div>
    </section>
  )
}

export default Login