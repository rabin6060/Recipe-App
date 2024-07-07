import logger from '../../config/logger';
import { Response } from 'express';
import { errorResponse } from '../../utils/HttpResponse/index';

export default class CustomError extends Error {
  statusCode: number;
  name: string;
  errors?: Object;

  constructor(message: string, statusCode: number, errors?: Object) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.errors = errors;
  }
}

export const errorHandler = (res: Response, error: unknown) => {
  logger.error(error);
  if (error instanceof CustomError) {
    console.log(error.stack);
    errorResponse({
      response: res,
      message: error.message,
      status: error.statusCode,
      data: error.errors,
    });
  } else if (error instanceof Error) {
    console.log(error.stack);
    errorResponse({
      response: res,
      message: error.message,
      status: 500,
    });
  } else {
    errorResponse({
      response: res,
      message: 'Internal Server Error',
      status: 500,
    });
  }
};
