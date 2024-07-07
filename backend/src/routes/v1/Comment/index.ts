import { Router } from 'express';
import { CommentController } from './controller';
import requireUser from '../../../Middleware/requireUser';


const CommentsRouter = Router({mergeParams:true});

CommentsRouter.route('/').post(requireUser,CommentController.create)

CommentsRouter.route('/:id')
.patch(requireUser,CommentController.update)
.delete(requireUser,CommentController.delete)

export default CommentsRouter;
