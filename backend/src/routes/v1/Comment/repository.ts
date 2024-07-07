import { CommentModel } from './model';
import {Review, UpdatedReview } from './type';

export const create = (body: Review) => {
  return CommentModel.create(body);
};

export const getRatings = (body:Review)=>{
  return CommentModel.find({userId:body.userId,type:body.type})
}

export const getComment = (id: string) => {
  return CommentModel.findById(id);
};

export const updateComment = (data: UpdatedReview,commentId:string,userId:string) => {
  return CommentModel.findOneAndUpdate({_id:commentId,userId:userId},data,{
      new:true
    })
};

export const deleteComment = (commentId:string,recipeId:string)=>{
 return CommentModel.findOneAndDelete({_id:commentId,recipeId:recipeId})
}

export const deleteRating = (ratingId:string,recipeId:string)=>{
 return CommentModel.findOneAndDelete({_id:ratingId,recipeId:recipeId})
}
