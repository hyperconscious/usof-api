import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/user.controller';
import { upload } from '../config/file-upload.config';
const UserRouter = Router();
const userController = new UserController();

UserRouter.get(
  '/',
  /* auth, */ async (req: Request, res: Response) => {
    await userController.getAllUsers(req, res);
  },
);

UserRouter.get(
  '/my-profile',
  /* auth, */ async (req: Request, res: Response) => {
    await userController.getUserById(req, res);
  },
);

UserRouter.get(
  '/:user_id',
  /* auth, */ async (req: Request, res: Response) => {
    await userController.getUserById(req, res);
  },
);

UserRouter.post(
  '/',
  /* auth, auth[admin] */ async (req: Request, res: Response) => {
    await userController.createUser(req, res);
  },
);

UserRouter.patch(
  '/:user_id',
  /* auth, */ async (req: Request, res: Response, next: NextFunction) => {
    await userController.updateUser(req, res, next);
  },
);

UserRouter.patch(
  '/avatar',
  /* auth, */ upload.single('avatar'),
  async (req: Request, res: Response) => {
    await userController.uploadAvatar(req, res);
  },
);

UserRouter.delete(
  '/:user_id',
  /* auth, */ async (req: Request, res: Response) => {
    await userController.deleteUser(req, res);
  },
);

export default UserRouter;
