import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res
    .status(StatusCodes.OK)
    .json({message: 'Hello ma friend. Check other useful rotes.',
  });
});

router.get('/example', (req: Request, res: Response) => {
  res
    .status(StatusCodes.OK)
    .json({ message: 'This is an example response from the API!' });
});

export { router };
