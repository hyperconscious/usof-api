import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../services/jwt.service';
import { ForbiddenError, UnauthorizedError } from '../utils/http-errors';

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('No token provided.');
  }

  const jwtService = new JWTService();
  const decoded = jwtService.verifyAccessToken(token);
  req.user = decoded;
  next();
}

export function authorizeRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || userRole !== requiredRole) {
      throw new ForbiddenError('Access denied.');
    }

    next();
  };
}
