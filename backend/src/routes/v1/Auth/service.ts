import CustomError from '../../../utils/Error';
import { getUserByEmailForAuth } from '../Users/repository';
import { Auth } from './types';
import { messages } from '../../../utils/Messages';
import { signJwt, verifyJwt } from '../../../utils/Jwt';
import { omit } from '../../../utils';
import { userPrivateFields } from '../Users/model';
import UserService from '../Users/service';

const AuthService = {
  async login(data: Auth) {
    const user = await getUserByEmailForAuth(data.email);
    if (!user) throw new CustomError(messages.auth.invalid_account, 401);
    if (user.pin) {
      throw new CustomError("please complete your verification first",403)
    }
    const isValid = await user.comparePassword(data.password);
    if (!isValid) throw new CustomError(messages.auth.invalid_account, 401);

    const accessToken = signJwt(omit(user.toJSON(), userPrivateFields), 'accessToken', { expiresIn: '7d' });
    const User = await UserService.updateUserWithToken(data.email,accessToken);
    const refreshToken = signJwt({ userId: user._id.toString() }, 'refreshToken', { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
      User
    };
  },

  async verifyToken(token: string, type: 'accessToken' | 'refreshToken') {
    const user = verifyJwt(token, type);
    return user
  },
};

export default AuthService;
