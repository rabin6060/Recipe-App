import logger from '../../config/logger';
import env from '../../config/env';
import jwt from 'jsonwebtoken';

export function signJwt(payload: Object, keyName: 'accessToken' | 'refreshToken', options?: jwt.SignOptions) {
  const keyValue = keyName === 'accessToken' ? env.accessKeySecret : env.refreshKeySecret;

  return jwt.sign(payload, keyValue, { ...(options && options) });
}

export function verifyJwt(token: string, keyName: 'accessToken' | 'refreshToken'): Object | null {
  const keyValue = keyName === 'accessToken' ? env.accessKeySecret : env.refreshKeySecret;

  try {
    const decoded = jwt.verify(token, keyValue);
    return decoded;
  } catch (e) {
    logger.error(e);
    return null;
  }
}
