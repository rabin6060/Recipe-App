import { axiosInstance } from "@/config/axios"



export const signup = (values:any)=>{
    return axiosInstance.post('/users',values)
}

export const editProfile = (userId:string | undefined,values:any) => {
    console.log(values)
    return axiosInstance.patch(`/users/${userId}`,values)
}

export const getAllUsers = ()=>{
    return axiosInstance.get('/users')
}

export const verify = (email:string|undefined,data:any)=>{
    console.log(data)
    return axiosInstance.post(`/users/verify/${email}`,data)
}

export const login =async (values:any) =>{
    const response = await axiosInstance.post('/auth/login',values)
    return response.data
}

export const logout = (id:string | undefined)=>{
    if (id===undefined) {
        return
    }
    return axiosInstance.post(`/auth/logout/${id}`)
}
