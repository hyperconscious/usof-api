import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import userRouter from './user.routes';
import authRouter from './auth.routes';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res
    .status(StatusCodes.OK)
    .json({ message: 'Hello ma friend. Check other useful rotes.' });
});

router.use('/users', userRouter);
router.use('/auth', authRouter);

export { router };
