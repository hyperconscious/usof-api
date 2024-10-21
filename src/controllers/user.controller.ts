import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from '../utils/http-errors';
import { StatusCodes } from 'http-status-codes';
import { UserRole } from '../entities/user.entity';
import { QueryOptions } from '../utils/paginator';
import { QueryOptionsDto } from '../dto/query-options.dto';

export class UserController {
  private static userService = new UserService();

  private static validateQueryDto(req: Request): QueryOptions {
    const { error, value: queryOptions } = QueryOptionsDto.validate(req.query, {
      abortEarly: false,
    });
    if (error) {
      throw new BadRequestError(
        error.details.map((detail) => detail.message).join('; '),
      );
    }
    return queryOptions;
  }

  public static async getAllUsers(req: Request, res: Response) {
    const queryOptions = UserController.validateQueryDto(req);

    const users = await UserController.userService.getAllUsers(queryOptions);
    return res.status(StatusCodes.OK).json(users);
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
      throw new ForbiddenError('You are not authorized to update this user.');
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
      throw new ForbiddenError('You are not authorized to update this user.');
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
      throw new ForbiddenError('You are not authorized to update this user.');
    }
    await UserController.userService.deleteUser(userId);
    return res.status(StatusCodes.NO_CONTENT).json();
  }
}
