import { NextFunction, Request,Response } from "express";
import {  Recipe} from "./type";
import { errorResponse, successResponse } from "../../../utils/HttpResponse";
import { RecipeService } from "./service";
import CustomError from "../../../utils/Error";

interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

export const RecipeController = {
    async create(req:Request<unknown,unknown,Recipe>,res:Response,next:NextFunction){
      const reqFiles = req as MulterRequest;
      try {
        const recipeData = req.body as Recipe;
        if (!reqFiles.files || (!reqFiles.files['images'] && !reqFiles.files['videos'])) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
          }

        const imageFiles = reqFiles.files['images'] || [];
        const videoFiles = reqFiles.files['videos'] || [];
        
        
        const urls = await RecipeService.uploadImages(imageFiles,videoFiles)
        const videourl = urls?.pop()
        const user = res.locals.user
        
        const newRecipeData = {...recipeData,userId:user._id,images:urls,video:videourl,username:user.username}
        const recipe =  await RecipeService.createRecipe(newRecipeData)
        return successResponse({
          response: res,
          message: 'task created successfully!!',
          data: recipe,
        });
      } catch (error) {
        next(error);
      }
    },
    async getAll(req:Request,res:Response,next:NextFunction){
      try {
          const { title, categories, ingredients,page,limit } = req.query as {
          title: string;
          categories: string;
          ingredients: string;
          page:string,
          limit:string
        };

        const recipes = await RecipeService.getAll({ title, categories, ingredients,page,limit });
        if (!recipes) {
          return errorResponse({
            response: res,
            message: 'recipes not found!!',
            data: null,
          });
        }
        return successResponse({
        response: res,
        message: 'recipe fetched successfully!!',
        data: recipes,
      });
      } catch (error) {
        next(error)
      }
    },
    async getSingleRecipe(req:Request<{id:string},unknown,unknown>,res:Response,next:NextFunction){
      const {id} = req.params
      try {
        const recipe = await RecipeService.getRecipe(id)
        if (!recipe) {
          return errorResponse({
            response: res,
            message: 'recipe not found!!',
            data: null,
          });
        }
        return successResponse({
        response: res,
        message: 'recipe fetched successfully!!',
        data: recipe,
      });
      } catch (error) {
        next(error)
      }
    },
    async edit(req:Request<{id:string},unknown,Recipe>,res:Response,next:NextFunction){
      const {id} = req.params
      //const recipeData = req.body
      
      try {
        const reqFiles = req as MulterRequest;

        const recipeData = req.body as Recipe;
        if (!reqFiles.files || (!reqFiles.files['images'] && !reqFiles.files['videos'])) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
          }

        const imageFiles = reqFiles.files['images'] || [];
        const videoFiles = reqFiles.files['videos'] || [];
        
        
        const urls = await RecipeService.uploadImages(imageFiles,videoFiles)
        const videourl = urls?.pop()
        const user = res.locals.user
        
        const newRecipeData = {...recipeData,userId:user._id,images:urls,video:videourl}
        const recipe = await RecipeService.getRecipe(id)
        if (!recipe) {
          return next(new CustomError("sorry recipe not exist",404))
        }
        if (recipe && recipe.userId?.toString() !== user._id) {
                return errorResponse({
                    response: res,
                    message: "unauthorizedd only user can update",
                    status:403
                })
        }
        const updated = await RecipeService.update(id,newRecipeData)
             return successResponse({
                    response: res,
                    message: 'task updated successfully!!',
                    data: updated,
                });
      }catch(error){
        next(error)
      }
    },
    async delete(req:Request<{id:string},unknown,unknown>,res:Response,next:NextFunction){
      const {id} = req.params
      const user = res.locals.user
      try {
        const recipe = await RecipeService.getRecipe(id)
        if (!recipe) {
          return next(new CustomError("sorry recipe not exist",404))
        }
        if (recipe && recipe.userId?.toString() !== user._id) {
                return errorResponse({
                    response: res,
                    message: "unauthorizedd only user can delete",
                    status:403
                })
        }
        await RecipeService.delete(id)
        
        return successResponse({
            response:res,
            message: 'recipe deleted successfully!!',
          });
      } catch (error) {
        next(error)
      }
    },
    async getRecipeOfUser(req:Request<{userId:string},unknown,unknown>,res:Response,next:NextFunction){
      const {userId} = req.params
      
      try {
        
        const recipe = await RecipeService.getUsersRecipe(userId)
        if (!recipe) {
          return errorResponse({
            response: res,
            message: 'recipe not found!!',
            data: null,
          });
        }
        return successResponse({
        response: res,
        message: 'recipe fetched successfully!!',
        data: recipe,
      });
      } catch (error) {
        next(error)
      }
    }
    
}
   
