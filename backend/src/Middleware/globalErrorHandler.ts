import { NextFunction, Request, Response } from 'express';
import CustomError, { errorHandler } from '../utils/Error';
import mongoose from 'mongoose';

const castErrorHandler = (error: mongoose.Error.CastError) => {
  const message = `API Validation Error`;
  let errors: { [key: string]: string } = {};
  errors[error.path] = 'Invalid value';
  return new CustomError(message, 400, errors);
};

const keyDuplicationError = (error: any) => {
  console.log(error);
  const message = `API Validation Error`;
  const errors: { [key: string]: string } = {};
  for (const key in error.keyPattern) {
    if (error.keyPattern.hasOwnProperty(key)) {
      errors[key] = `This ${key.toLowerCase()} already exists`;
    }
  }
  console.log(errors);
  return new CustomError(message, 400, errors);
};

const validationErrorHandler = (error: mongoose.Error.ValidationError) => {
  const message = `API Validation Error`;
  const validationsErrors: { [key: string]: string } = {};
  Object.values(error.errors).forEach(el => (validationsErrors[el.path] = error.message));
  return new CustomError(message, 400, validationsErrors);
};

export const globalErrorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  let err: CustomError | null = null;

  if (typeof error === 'object' && error && 'code' in error && error.code === 11000) err = keyDuplicationError(error);
  else if (error instanceof mongoose.Error.CastError) err = castErrorHandler(error);
  else if (error instanceof mongoose.Error.ValidationError) err = validationErrorHandler(error);

  if (err) errorHandler(res, err);
  else errorHandler(res, error);
};
