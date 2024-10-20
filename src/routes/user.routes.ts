import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { upload } from '../config/file-upload.config';
import { auth, authorizeRole } from '../middlewares/auth.middleware';
import { UserRole } from '../entities/user.entity';
const userRouter = Router();

userRouter.get('/', auth, UserController.getAllUsers);

userRouter.get('/my-profile', auth, UserController.getUserById);

userRouter.get('/:user_id', auth, UserController.getUserById);

userRouter.post(
  '/',
  auth,
  authorizeRole(UserRole.Admin),
  UserController.createUser,
);

userRouter.patch('/:user_id', auth, UserController.updateUser);

userRouter.patch(
  '/avatar',
  auth,
  upload.single('avatar'),
  UserController.uploadAvatar,
);

userRouter.delete('/:user_id', auth, UserController.deleteUser);

export default userRouter;
