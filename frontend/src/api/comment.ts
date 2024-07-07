import { axiosInstance } from "@/config/axios"

export const create = (id:string | undefined,values:any)=>{
    return axiosInstance.post(`/recipe/${id}/comments`,values)
}
export const deleteComment = (id:string | undefined,commentId:string | undefined)=>{
    return axiosInstance.delete(`/recipe/${id}/comments/${commentId}`)
}

