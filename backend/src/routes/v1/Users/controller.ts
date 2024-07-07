import { Response, Request } from 'express';
import CustomError, { errorHandler } from '../../../utils/Error/index';
import UserService from './service';
import { errorResponse, successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import { NextFunction } from 'express';
import { generateCode } from '../../../utils/GenerateCode';
import { sendMail } from '../../../utils/SendMail';
import { Body, UpdatedBody } from './type';
import cron from 'node-cron';

const UserController = {
  async createUser(req: Request<unknown, unknown, Body>, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const code = generateCode(6);
      const user = await UserService.getUser(body.email);
      if (user) {
        return errorResponse({
          response: res,
          message: messages.user.user_exist,
        });
      }
      const profile = req.files as Express.Multer.File[];
      const urls = await UserService.uploadProfile(profile);
      const profilePicUrl = urls && urls[0];
      const result = await UserService.createUser({ ...body, pin: code, profilePic: profilePicUrl });
      const options = {
        email: body.email,
        subject: 'confirmation code',
        message: code,
      };
      await sendMail(options);
      return successResponse({
        response: res,
        message: messages.user.verfiy_user,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyUser(req: Request<{ email: string }, unknown, { pin: string }>, res: Response) {
    const { pin } = req.body;
    const { email } = req.params;
    const user = await UserService.getUser(email);
    if (!user) {
      return errorResponse({
        response: res,
        message: messages.user.verification_failed,
      });
    }

    let userAttempts = user.verificationAttempt || 0;

    if (userAttempts >= 4) {
      await UserService.deleteUser(email);
      return errorResponse({
        response: res,
        message: 'Too many verification attempts and failed. Please re-Register',
      });
    }
    if (pin && user.pin !== pin) {
      user.verificationAttempt = userAttempts + 1;
      await user.save();
      return errorResponse({
        response: res,
        message: messages.user.verification_failed,
      });
    }
    user.verificationAttempt = 0;
    await user.save();

    const data = await UserService.updateUserInfo(user.email);
    return successResponse({
      response: res,
      message: messages.user.creation_success,
      data: data,
    });
  },

  async getUser(req: Request<{ id: string }, unknown, unknown>, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      if (!user) {
        return errorResponse({
          response: res,
          message: messages.user.user_not_found,
        });
      }
      return successResponse({
        response: res,
        message: messages.user.user_found,
        data: user,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },

  async getUsers(req: Request, res: Response) { 
    try {
      const result = await UserService.getUsers();
      return successResponse({
        response: res,
        message: 'Fetched Users successfully',
        data: result,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },

  async update(req: Request<{ id: string }, unknown, UpdatedBody>, res: Response) {
    try {
      const { id } = req.params;
      const user = res.locals.user;
      const { username, friend ,favourite} = req.body;
      const profile = req.files as Express.Multer.File[];
      const urls = await UserService.uploadProfile(profile);
      const profilePicUrl = urls && urls[0];
      if (!user || id!==user._id) {
             return errorResponse({
                        response: res,
                        message: 'unauthorized user!!!',
                    });
        }

      const result = await UserService.updateUser(id, { username: username, profilePic: profilePicUrl, friend: friend,favourite:favourite });

      if (!result) {
        return errorResponse({
          response: res,
          message: 'updated Failed!!',
        });
      }
      return successResponse({
        response: res,
        message: 'Updated Users successfully',
        data: result,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },

  async delete(req: Request<{ id: string }, unknown, unknown>, res: Response) {
    try {
      const { id } = req.params;
      const user = res.locals.user;
      if (id !== user._id.toString()) {
        throw new CustomError('you are not authorized!!!', 403);
      }
      const userInfo = await UserService.getUserById(id);
      if (!userInfo) {
        throw new CustomError('user not found', 404);
      }
      const result = await UserService.deleteUser(user._id);
      if (!result) {
        return errorResponse({
          response: res,
          message: 'deletion Failed!!',
        });
      }
      return successResponse({
        response: res,
        message: 'Deleted Users successfully',
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },

  async findAndDeleteUnverifiedUser() {
    try {
      const user = await UserService.getUsers();
      for (const doc of user) {
        if (doc.pin) {
          console.log(doc.pin, doc.email);
          await UserService.deleteUser(doc.email);
        }
      }
    } catch (error) {
      return new CustomError('checking unverified documents and deleting them', 402)
    }
  },
};

cron.schedule('*/5 * * * *', () => {
  console.log('Running the task every five minute');
  UserController.findAndDeleteUnverifiedUser();
});

export default UserController;
