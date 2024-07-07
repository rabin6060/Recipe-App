import { Router } from 'express';
import UserController from './controller';
import {rateLimit} from 'express-rate-limit'
import upload from '../../../Middleware/multer';

const UserRouter = Router();
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: 'Too many requests, please wait for a while!',
    });
  },
});
// Get All the users
UserRouter.route('/').get(UserController.getUsers);

// Get one user
UserRouter.route('/:id').get(UserController.getUser);

// Get me route

// Create new user
UserRouter.route('/').post(upload.array('profilePic', 1),UserController.createUser);
UserRouter.route('/verify/:email').post(limiter,UserController.verifyUser);

// Update a user
 UserRouter.route('/:id')
 .patch(upload.array('profilePic', 1),UserController.update)
 .delete(UserController.delete)

// Delete a post
// UserRouter.route('/:id').delete();

export default UserRouter;
