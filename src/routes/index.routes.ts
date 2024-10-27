import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import userRouter from './user.routes';
import authRouter from './auth.routes';
import postRouter from './post.routes';
import categoryRouter from './category.routes';
import commentRouter from './comment.routes';
import favouriteRouter from './favourite.routes';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res
    .status(StatusCodes.OK)
    .json({ message: 'Hello ma friend. Check other useful rotes.' });
});

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/posts', postRouter);
router.use('/categories', categoryRouter);
router.use('/comments', commentRouter);
router.use('/favourites', favouriteRouter);

export { router };
