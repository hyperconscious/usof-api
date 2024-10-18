import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post('/refresh', AuthController.refresh);

// authRouter.post('/password-reset', );
// authRouter.post('/password-reset/<confirm_token>', );

export default authRouter;
