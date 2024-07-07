import { axiosInstance } from "@/config/axios"

export const get = ()=>{
    return axiosInstance.get(`/notifications`)
}


