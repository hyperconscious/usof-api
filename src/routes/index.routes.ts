import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserRouter from './user.routes';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res
    .status(StatusCodes.OK)
    .json({ message: 'Hello ma friend. Check other useful rotes.' });
});

router.use('/users', UserRouter);

export { router };
