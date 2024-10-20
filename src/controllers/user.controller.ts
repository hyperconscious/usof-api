import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { BadRequestError, UnauthorizedError } from '../utils/http-errors';
import { StatusCodes } from 'http-status-codes';
import { UserRole } from '../entities/user.entity';
import { PaginationOptions, SortOptions } from '../utils/paginator';

export class UserController {
  private static userService = new UserService();

  public static async getAllUsers(req: Request, res: Response) {
    const { page = '1', limit = '10'} = req.query;

    const paginationOptions: PaginationOptions = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    const users = await UserController.userService.getAllUsers(paginationOptions);
    return res.status(StatusCodes.OK).json({ data: users });
  }

  public static async getUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.user_id, 10) || req.user?.id!;

    if (userId === undefined) {
      throw new UnauthorizedError('You need to be logged in.');
    }
    const user = await UserController.userService.getUserById(userId);
    return res.status(StatusCodes.OK).json({ data: user });
  }

  public static async createUser(req: Request, res: Response) {
    const { login, password, full_name, passwordConfirmation, email, role } =
      req.body;
    if (password !== passwordConfirmation) {
      throw new BadRequestError('Password confirmation does not match.');
    }

    const newUser = await UserController.userService.createUser({
      login,
      full_name,
      password,
      email,
      role,
    });

    return res.status(StatusCodes.CREATED).json({ data: newUser });
  }

  public static async updateUser(req: Request, res: Response) {
    const userData = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError('You need to be logged in.');
    }

    if (
      req.user?.role !== UserRole.Admin &&
      userId !== parseInt(req.params.user_id, 10)
    ) {
      throw new BadRequestError('You are not authorized to update this user.');
    }

    const updatedUser = await UserController.userService.updateUser(
      userId,
      userData,
    );
    return res
      .status(StatusCodes.OK)
      .json({ status: 'success', data: updatedUser });
  }

  public static async uploadAvatar(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError('You need to be logged in.');
    }

    if (
      req.user?.role !== UserRole.Admin &&
      userId !== parseInt(req.params.user_id, 10)
    ) {
      throw new BadRequestError('You are not authorized to update this user.');
    }

    if (!req.file) {
      throw new BadRequestError('No file uploaded.');
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await UserController.userService.updateUser(userId, {
      avatar: avatarUrl,
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Avatar uploaded successfully.', data: updatedUser });
  }

  public static async deleteUser(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError('You need to be logged in.');
    }

    if (
      req.user?.role !== UserRole.Admin &&
      userId !== parseInt(req.params.user_id, 10)
    ) {
      throw new BadRequestError('You are not authorized to update this user.');
    }
    await UserController.userService.deleteUser(userId);
    return res.status(StatusCodes.NO_CONTENT).json();
  }
}
