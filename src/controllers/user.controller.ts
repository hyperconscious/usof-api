import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { BadRequestError } from '../utils/http-errors';
import { StatusCodes } from 'http-status-codes';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    return res.status(StatusCodes.OK).json({ data: users });
  }

  public async getUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.user_id, 10);
    const user = await this.userService.getUserById(userId);
    return res.status(StatusCodes.OK).json({ data: user });
  }

  public async createUser(req: Request, res: Response) {
    const { login, password, passwordConfirmation, email, role } = req.body;
    if (password !== passwordConfirmation) {
      throw new BadRequestError('Password confirmation does not match.');
    }

    const newUser = await this.userService.createUser({
      login,
      password,
      email,
      role,
    });

    return res.status(StatusCodes.CREATED).json({ data: newUser });
  }

  public async updateUser(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.user_id, 10);
    const userData = req.body;

    const updatedUser = await this.userService.updateUser(userId, userData);
    return res
      .status(StatusCodes.OK)
      .json({ status: 'success', data: updatedUser });
  }

  public async uploadAvatar(req: Request, res: Response) {
    if (!req.file) {
      throw new BadRequestError('No file uploaded.');
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const userId = parseInt(req.params.user_id, 10);

    const updatedUser = await this.userService.updateUser(userId, {
      avatar: avatarUrl,
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Avatar uploaded successfully.', data: updatedUser });
  }

  public async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.user_id, 10);
    await this.userService.deleteUser(userId);
    return res.status(StatusCodes.NO_CONTENT).json();
  }
}
