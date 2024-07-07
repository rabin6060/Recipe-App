import { create, deleteComment, deleteRating, getComment, updateComment } from './repository';
import {  Review, UpdatedReview } from './type';
import { addCommentToRecipe, addRatingToRecipe, getSingleRecipe, removeCommentFromRecipe, removeRatingFromRecipe } from '../Recipe/repository';
import CustomError from '../../../utils/Error';
import { sendMessageToUser } from '../../../..';
import { ActivityService } from '../Notification/service';

export const CommentService = {
  async createComment(body: Review, recipeId: string) {
    const comment = await create(body);
    const friend = body && body.userId?.toString() || ""
    if (comment) {
        const message ={ username:body.username ?? "",userId:body.userId ?? "",time:new Date( Date.now()).toISOString(),content:`${body?.username} commented on your post`}
        await ActivityService.createActivity(message)
        sendMessageToUser(friend, message);
      }
    addCommentToRecipe(recipeId, comment._id.toString());
    return comment;
  },
  async createRating(body:Review,recipeId:string){
    const rating = await create(body);
    const friend = body && body.userId?.toString() || ""
    if (rating) {
        const message ={ username:body.username ?? "",userId:body.userId ?? "",time:new Date( Date.now()).toISOString(),content:`${body?.username} rate your recipe`}
        await ActivityService.createActivity(message)
        sendMessageToUser(friend, message);
      }
    addRatingToRecipe(recipeId, rating._id.toString());
    return rating;
    
    
  },

  async getComment(commentId: string) {
    const comment = await getComment(commentId);
    return comment;
  },
  async updateComment(data: UpdatedReview, commentId: string, userId: string) {
    const comment = await getComment(commentId);
    if (!comment) {
      throw new CustomError('no comment found', 400);
    }
    const update = await updateComment(data, commentId, userId);
    if (!update) {
      throw new CustomError('unauthorized!!!', 400);
    }
    return update;
  },

  async deleteComment(id: string, recipeId: string) {
    const comment = await getComment(id);

    if (!comment) {
      throw new CustomError('already deleted!!', 400);
    }
    const recipe = await getSingleRecipe(recipeId);
    if (!recipe) {
      throw new CustomError('no recipe', 400);
    }

    const deleteCommens = await deleteComment(id, recipeId);
    console.log(deleteCommens);
    if (!deleteCommens) {
      throw new CustomError('not deleted!!!', 400);
    }

    await removeCommentFromRecipe(recipeId, id);
    return deleteCommens;
  },
   async deleteRating(id: string, recipeId: string) {
    const comment = await getComment(id);

    if (!comment) {
      throw new CustomError('already deleted!!', 400);
    }
    const recipe = await getSingleRecipe(recipeId);
    if (!recipe) {
      throw new CustomError('no recipe', 400);
    }

    const deleteCommens = await deleteRating(id, recipeId);
    console.log(deleteCommens);
    if (!deleteCommens) {
      throw new CustomError('not deleted!!!', 400);
    }

    await removeRatingFromRecipe(recipeId, id);
    return deleteCommens;
  }
};
