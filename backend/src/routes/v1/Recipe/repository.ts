
import mongoose from "mongoose";
import { RecipeModel } from "./model";
import { Recipe } from "./type";

export const createRecipes = (body:Recipe)=>{
    return  RecipeModel.create(body)
}
export const getAllRecipes = (filter:{},skip:number,limit:number) =>{
  return RecipeModel.find(filter).skip(skip).limit(limit).populate('userId','-__v -password -verificationAttempt')
}
export const getSingleRecipe = (id:string) =>{
  return RecipeModel.findById(id).populate('comments','-__v ').populate('ratings','-__v')
}
export const getUserRecipe = (id:string) =>{
  return RecipeModel.find({userId:id}).populate('userId','-__v -password -verificationAttempt')
}
export const deleteRecipe = (id:string) => {
  return RecipeModel.findByIdAndDelete(id)
}
export const updateRecipe = (id:string,recipeData:Recipe)=>{
   return RecipeModel.findByIdAndUpdate(id,
        recipeData
    ,{new:true})
}



//comment-task
export const addCommentToRecipe = async(recipeId:string,commentId:string)=>{
    return RecipeModel.findOneAndUpdate(
    { _id: recipeId },
    {
      $push: {
        comments: new mongoose.Types.ObjectId(commentId),
      },
    },
  );
}
export const removeCommentFromRecipe = async(RecipeId:string,commentId:string)=>{
    return RecipeModel.findOneAndUpdate(
    { _id: RecipeId},
    {
      $pull: {
        comments: new mongoose.Types.ObjectId(commentId),
      },
    },
  );
}
export const addRatingToRecipe = async(recipeId:string,ratingId:string)=>{
    return RecipeModel.findOneAndUpdate(
    { _id: recipeId },
    {
      $push: {
        ratings: new mongoose.Types.ObjectId(ratingId),
      },
    },
  );
}
export const removeRatingFromRecipe = async(RecipeId:string,ratingId:string)=>{
    return RecipeModel.findOneAndUpdate(
    { _id: RecipeId},
    {
      $pull: {
        ratings: new mongoose.Types.ObjectId(ratingId),
      },
    },
  );
}
//tags-task
export const addTagToTask = async(taskId:string | undefined,tagId:string)=>{
    return RecipeModel.findOneAndUpdate(
    { _id: taskId },
    {
      $push: {
        tags: new mongoose.Types.ObjectId(tagId),
      },
    },
  );
}
