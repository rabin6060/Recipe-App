import { Response } from 'express';

export const successResponse = (props: { response: Response; message: string; status?: number; data?: unknown }) => {
  const { message, response, data, status } = props;
  response.status(status || 200).json({
    status: status,
    message,
    data,
  });
};

export const errorResponse = (props: { response: Response; message: string; data?: unknown; status?: number }) => {
  const { response, message, data, status } = props;
  response.status(status || 500).json({
    status: status || 500,
    message: message,
    data,
  });
};
