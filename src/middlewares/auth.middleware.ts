import { NextFunction, Response } from 'express';
import { authService } from '../services/auth.service';
import { IAuthRequest } from '../types/express.types';

export const authMiddleware = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'Authorization header missing' });
      return;
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      res.status(401).json({ error: 'Invalid authorization format' });
      return;
    }

    const decoded = authService.verifyToken(token);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
