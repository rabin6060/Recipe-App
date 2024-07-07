import { Router } from 'express';

import Health from './Health';
import UserRouter from './Users';
import AuthRouter from './Auth';

import ActivityRouter from './Notification';
import RecipeRouter from './Recipe';
import CommentsRouter from './Comment';
import NotificationRouter from './Notification';

const router = Router();

router.use('/health', Health);
router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/activities', ActivityRouter);
router.use('/recipe/:recipeId/comments',CommentsRouter)
router.use('/recipe',RecipeRouter)
router.use('/notifications',NotificationRouter)


export default router;
