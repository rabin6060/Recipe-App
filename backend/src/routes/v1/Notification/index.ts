import { Router } from 'express';
import {ActivityController} from './controller';
import requireUser from '../../../Middleware/requireUser';


const NotificationRouter = Router();
NotificationRouter.route('/').post(ActivityController.create);
NotificationRouter.route('/').get(requireUser,ActivityController.get);

export default NotificationRouter;
