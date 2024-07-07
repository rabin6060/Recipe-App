import { axiosInstance } from "@/config/axios";

export const create = async (values:any) => {
    try {
        const response = await axiosInstance.post('/recipe', values, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading recipe:', error);
        throw error;
    }
};
export const getSingleRecipe = (id:string | undefined)=>{
    return axiosInstance.post(`/recipe/${id}`)
}
export const getRecipeUser = (id:string | undefined)=>{
    if (id===undefined) {
        return
    }
    return axiosInstance.get(`/recipe/${id}/user`)
}

export const getAllRecipe = (query:string) => {
    return axiosInstance.get(`/recipe?${query}`)
}

export const updateRecipe = (id:string,values:any) => {
    return axiosInstance.patch(`/recipe/${id}`,values)
}

export const deleteRecipe = (id:string) => {
    return axiosInstance.delete(`/recipe/${id}`)
}