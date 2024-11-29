import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post('/refresh', AuthController.refresh);

authRouter.post(
  '/send-verification-email/',
  AuthController.sendVerificationEmail,
);
authRouter.post('/verify-email/', AuthController.verifyEmail);
authRouter.post('/forgot-password', AuthController.forgotPassword);
authRouter.post('/password-reset', AuthController.resetPassword);

export default authRouter;
