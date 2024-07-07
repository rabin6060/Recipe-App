
import cloudinary from "../../../utils/Cloudinary";
//import { create } from "../Notification/repository";
import { createRecipes, deleteRecipe, getAllRecipes, getSingleRecipe, getUserRecipe, updateRecipe} from "./repository";
import { Recipe } from "./type";


export const RecipeService = {
    async createRecipe(body:Recipe){
        const res = await createRecipes(body)
        return res

    },
    async getAll(query:{title?:string,categories?:string,ingredients?:string,page:string,limit:string}){
        let filter = {};
        let page = parseInt(query.page)
        let limit = parseInt(query.limit)
        let skip:number
        skip = (page-1)*limit
        if (query.title || query.categories || query.ingredients) {
          // Construct the filter object based on query parameters
          filter = {
            ...(query.title && { title: new RegExp(query.title as string, 'i') }),
            ...(query.categories && { items: { $in: (query.categories as string).split(',') } }),
            ...(query.ingredients && { ingredients: { $in: (query.ingredients as string).split(',') } }),
          };
        }
        return getAllRecipes(filter,skip,limit)
    },
    async getRecipe(id:string){
        return getSingleRecipe(id)
    },
    async getUsersRecipe(userId:string){
        return getUserRecipe(userId)
    },
    async delete(id:string){
        return deleteRecipe(id)
    },
    async update(id:string,recipeData:Recipe){
        return updateRecipe(id,recipeData)
    },
    async uploadImages(imageFiles:Express.Multer.File[],videoFiles:Express.Multer.File[]){
        const uploadImagePromises = imageFiles.map((image) =>
            cloudinary.uploader.upload(image.path)
        );
        const uploadVideoPromises = videoFiles.map((video) =>
            cloudinary.uploader.upload(video.path,{resource_type:'video'})
        );

        try {
            const results = await Promise.all([...uploadImagePromises,...uploadVideoPromises]);
            const uploadUrls: string[] = results.map(result => result?.secure_url);
            
            return uploadUrls
        } catch (err) {
            console.error(err);
        }
    }
}
