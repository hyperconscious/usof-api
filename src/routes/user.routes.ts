import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { uploadSingle } from '../config/file-upload.config';
import { auth, authorizeRole } from '../middlewares/auth.middleware';
import { UserRole } from '../entities/user.entity';
const userRouter = Router();

userRouter.get('/', auth, UserController.getAllUsers);

userRouter.post(
  '/',
  auth,
  authorizeRole(UserRole.Admin),
  UserController.createUser,
);

userRouter.get('/my-profile', auth, UserController.getUserById);
userRouter.patch(
  '/:user_id/avatar',
  auth,
  uploadSingle,
  UserController.uploadAvatar,
);

userRouter.get('/:user_id', auth, UserController.getUserById);

userRouter.get('/:user_id/liked', auth, UserController.getAllLikedPosts);

userRouter.patch('/:user_id', auth, UserController.updateUser);

userRouter.delete('/:user_id', auth, UserController.deleteUser);

export default userRouter;
