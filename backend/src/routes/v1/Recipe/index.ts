import { Router } from 'express';
import { RecipeController } from './controller';
import upload from '../../../Middleware/multer';
import requireUser from '../../../Middleware/requireUser';


const RecipeRouter = Router({ mergeParams: true });

RecipeRouter.route('/')
  .post(requireUser,upload.fields([{name:'images',maxCount:5},{name:'videos',maxCount:1}]),RecipeController.create)
  .get(RecipeController.getAll)
  
RecipeRouter.route('/:userId/user')
  .get(RecipeController.getRecipeOfUser)


RecipeRouter.route('/:id/download')
  .get(RecipeController.downloadRecipe)

RecipeRouter.route('/:id')
  .post(RecipeController.getSingleRecipe)
  .delete(requireUser,RecipeController.delete)
  .patch(requireUser,upload.fields([{name:'images',maxCount:5},{name:'videos',maxCount:1}]),RecipeController.edit)




export default RecipeRouter;
