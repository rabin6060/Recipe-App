import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {z} from 'zod'
import { Button } from "@/components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
import { verify } from "@/api/user"
import axios from "axios"
import { useState } from "react"

import VerifyAnimation from '../../assets/verify.json'
import Lottie from 'lottie-react'
import { toast } from "sonner"

const Verify = () => {
   const {email} = useParams()
   const form = useForm({
    defaultValues: {
      pin: "",
    },
  })
  const navigate = useNavigate()
  const [_userInfo,setUserInfo] = useState({})
  const [_error,setError] = useState<Error | null>(null)
  const [loading,setLoading] = useState<boolean>(false)
  const [tryCount,setTryCount] = useState<number>(0)

  const FormSchema = z.object({
    pin: z.string().min(6, {
      message: "Your one-time password must be 6 characters.",
    }),
  })
  async function onSubmit(data: z.infer<typeof FormSchema>) {
     try {
      setLoading(true)
      setError(null)
      const response = await verify(email,data)
      if (!response) {
        setLoading(false)
      }
      setError(null)
      setLoading(false)
      setUserInfo(response)
      setTryCount(0)
      toast("OTP verified!!!")
      navigate(`/login`)
    } catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        setTryCount((prev)=>prev+1)
        if (tryCount==4) {
          navigate('/signup')
        }
        setLoading(false)
        setError(error.response.data)
        toast("Verification Failed!!!")
      }
     }
    }
  }
  return (
    <section className="w-full h-auto flex items-center justify-center mt-10">
      <div className="w-full mx-auto flex items-center justify-center py-20">
        <div className="w-1/2">
           <Lottie animationData={VerifyAnimation} />
        </div>
        <div className="w-1/2">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem className="space-y-10">
              <div>
               <FormLabel className="text-3xl text-teal-500">Enter OTP</FormLabel>
               <p className="text-teal-500">Please check your email.We have sent verficication code!!</p>
              </div>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="text-lg text-teal-500" />
                    <InputOTPSlot index={1} className="text-lg text-teal-500" />
                    <InputOTPSlot index={2} className="text-lg text-teal-500" />
                    <InputOTPSlot index={3} className="text-lg text-teal-500" />
                    <InputOTPSlot index={4} className="text-lg text-teal-500" />
                    <InputOTPSlot index={5} className="text-lg text-teal-500" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className="text-lg text-teal-500">
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-yellow-500">Verification Attempt {tryCount}</p>
        <p className="text-red-500">You can only try for 5 times. After that you will be redirected to Register Page</p>
        <Button type="submit" className="text-2xl bg-teal-500 px-8 hover:bg-purple-500">{!loading?'Verify':'Verifying....'}</Button>
      </form>
        </Form>
        </div>
      </div>
    </section>
  )
}

export default Verify