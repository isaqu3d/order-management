import { NextFunction, Request, Response } from 'express';
import { env } from '../configs/env';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error('Error:', error);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(env.nodeEnv === 'development' && { stack: error.stack }),
  });
};
