import { NextFunction, Request, Response } from 'express';
import { Review, UpdatedReview } from './type';
import { CommentService } from './service';
import { errorResponse, successResponse } from '../../../utils/HttpResponse';
import { getSingleRecipe } from '../Recipe/repository';


export const CommentController = {
  async create(req: Request<{recipeId:string}, unknown, Review>, res: Response) {
    try {
        const { recipeId } = req.params;
        const user = res.locals.user;
        const response = await getSingleRecipe(recipeId)
        const friend:string =response && response.userId && response?.userId.toString() || ""
        // Determine if we are dealing with a comment or rating
        if (req.body.type === 'comment' && response) {
            if (req.body.content && req.body.content.length > 1) {
               
                const comment = {
                    ...req.body,
                    recipeId: recipeId,
                    userId: friend,
                    user: user.username,
                    type: "comment",
                    username:user.username
                };

                const newComment = await CommentService.createComment(comment,recipeId);

                if (!newComment) {
                    return errorResponse({
                        response: res,
                        message: 'Comment creation failed!!!',
                    });
                }

                return successResponse({
                    response: res,
                    message: 'Comment successfully added.',
                    data: newComment,
                });
            } else {
                return errorResponse({
                    response: res,
                    message: 'Content is required and should be more than 1 character.',
                });
            }
        } else if (req.body.type === 'rating') {
            if (req.body.rating) {
                const rating = {
                    ...req.body,
                    recipeId: recipeId,
                    userId: friend,
                    user: user.username,
                    type: "rating",
                    username:user.username
                };

                const newRating = await CommentService.createRating(rating,recipeId);

                if (newRating===undefined) {
                    return errorResponse({
                        response: res,
                        message: 'Rating creation failed!!!',
                    });
                }

                return successResponse({
                    response: res,
                    message: 'Rating successfully added.',
                    data: newRating,
                });
            } else {
                return errorResponse({
                    response: res,
                    message: 'Rating is required.',
                });
            }
        } else {
            return errorResponse({
                response: res,
                message: 'Invalid type provided. Must be either "comment" or "rating".',
            });
        }
    } catch (error) {
        return errorResponse({
            response: res,
            message: 'An error occurred while creating the review.',
        });
    }
    
    
  },
  async update(req:Request<{id:string},unknown,UpdatedReview>,res:Response,next:NextFunction){
    try {
      const {id} = req.params
      const body = req.body
      const user = res.locals.user
      const commentInfo = {...body,userId:user._id}
      const result = await CommentService.updateComment(commentInfo,id,user._id)
      return successResponse({
        response: res,
        message: "updated successfully",
        data: result,
        status: 201,
      });

    } catch (error) {
      next(error)
    }
  },
  async delete(req: Request<{recipeId:string,id:string}>, res: Response,next:NextFunction) {
    try {
    const {id,recipeId} = req.params
    const recipe = await getSingleRecipe(recipeId)
    const user = res.locals.user
    const userId:string =recipe?.userId &&  recipe?.userId.toString() || ""
    console.log(user._id,recipe?.userId)
    if (user._id !== userId) {
         return errorResponse({
                    response: res,
                    message: 'unauthorized!!!.',
                });
    }
    await CommentService.deleteComment(id,recipeId)
    
     return successResponse({
        response: res,
        message: "comment deleted successfully",
        status: 201,
      });
    } catch (error) {
      next(error)
    }
  },
}

