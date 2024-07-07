import { axiosInstance } from "@/config/axios"


export const uploadImage = (values:any)=>{
    console.log(values)
    return axiosInstance.post('/upload',{values})
}