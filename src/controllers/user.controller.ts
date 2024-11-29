import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from '../utils/http-errors';
import { StatusCodes } from 'http-status-codes';
import { UserRole } from '../entities/user.entity';
import { queryOptionsDto, QueryOptions } from '../dto/query-options.dto';
import { JWTService } from '../services/jwt.service';
import { MailService } from '../services/mail.service';
import { createUserDto } from '../dto/user.dto';

export class UserController {
  private static jwtService = new JWTService();
  private static mailService = new MailService();
  private static userService = new UserService();

  private static validateQueryDto(req: Request): QueryOptions {
    const { error, value: queryOptions } = queryOptionsDto.validate(req.query, {
      abortEarly: false,
    });
    if (error) {
      throw new BadRequestError(
        error.details.map((detail) => detail.message).join('; '),
      );
    }
    return queryOptions;
  }

  public static async getAllLikedPosts(req: Request, res: Response) {
    const queryOptions = UserController.validateQueryDto(req);
    const userId = req.params.user_id as unknown as number;
    const user = await UserController.userService.getUserById(userId);

    const posts = await UserController.userService.getAllLikedPosts(
      userId,
      queryOptions,
    );
    return res.status(StatusCodes.OK).json(posts);
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
    const UserDto = await createUserDto.validateAsync(req.body);
    if (
      UserDto.passwordConfirmation &&
      UserDto.password !== UserDto.passwordConfirmation
    ) {
      throw new BadRequestError('Password confirmation does not match.');
    }
    let verified = false;
    if (req.user?.role === UserRole.Admin) {
      verified = true;
    }

    const newUser = await UserController.userService.createUser({
      ...UserDto,
      verified,
    });

    return res.status(StatusCodes.CREATED).json({ data: newUser });
  }

  public static async updateUser(req: Request, res: Response) {
    const callbackUrl = req.headers['x-callback-url'];
    const userData = req.body;
    const userId = req.user!.id;

    if (
      (req.user?.role !== UserRole.Admin &&
        userId !== parseInt(req.params.user_id, 10)) ||
      (userData.UserRole && req.user?.role !== UserRole.Admin)
    ) {
      throw new ForbiddenError('You are not authorized to update this user.');
    }

    if (userData.login) {
      const user = await UserController.userService.getUserByLoginSafe(
        userData.login,
      );
      if (user && user.id !== parseInt(req.params.user_id, 10)) {
        console.log(`${user?.id} - ${req.params.user_id}`);
        throw new BadRequestError('Login already exists.');
      }
    }

    if (userData.email) {
      const user = await UserController.userService.getUserByEmailSafe(
        userData.email,
      );
      if (user && user.id !== parseInt(req.params.user_id, 10)) {
        throw new BadRequestError('Email already exists.');
      }
    }

    const updatedUser = await UserController.userService.updateUser(
      parseInt(req.params.user_id, 10),
      userData,
    );
    return res
      .status(StatusCodes.OK)
      .json({ status: 'success', data: updatedUser });
  }

  public static async uploadAvatar(req: Request, res: Response) {
    const userId = Number(req.params.user_id) || req.user!.id;
    if (!req.file) {
      throw new BadRequestError('No file uploaded.');
    }

    const user = await UserController.userService.getUserById(userId);
    if (userId !== req.user?.id && req.user?.role !== UserRole.Admin) {
      throw new ForbiddenError('You are not authorized to update this user.');
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
    const userId = Number(req.params.user_id);

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
