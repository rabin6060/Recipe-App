import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../routes/v1/Users/repository';
import CustomError, { errorHandler } from '../utils/Error';

export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user as Object;
  let isValid = false;
  if (user && '_id' in user && typeof user._id === 'string') {
    const userData = await getUserById(user._id);
    if (userData) isValid = true;
  }

  if (isValid) next();
  else errorHandler(res, new CustomError('Unauthorized User', 401));
};

export default requireUser;
