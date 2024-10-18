import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { JWTService } from '../services/jwt.service';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../utils/http-errors';

export class AuthController {
  private static userService = new UserService();
  private static jwtService = new JWTService();

  public static async register(req: Request, res: Response) {
    const {
      login,
      password,
      full_name,
      passwordConfirmation,
      email,
      role = 'user',
    } = req.body;
    if (password !== passwordConfirmation) {
      throw new BadRequestError('Password confirmation does not match.');
    }

    const user = await AuthController.userService.createUser({
      login,
      password,
      full_name,
      email,
      role,
    });
    const accessToken = AuthController.jwtService.generateAccessToken(user);
    const refreshToken = AuthController.jwtService.generateRefreshToken(user);

    return res.status(StatusCodes.CREATED).json({ accessToken, refreshToken });
  }

  public static async login(req: Request, res: Response) {
    const { loginOrEmail, password } = req.body;
    const user = await AuthController.userService.validateUserCredentials(
      loginOrEmail,
      password,
    );

    if (!user) {
      throw new BadRequestError('Invalid login or password.');
    }

    const accessToken = AuthController.jwtService.generateAccessToken(user);
    const refreshToken = AuthController.jwtService.generateRefreshToken(user);

    return res.status(StatusCodes.OK).json({ accessToken, refreshToken });
  }

  public static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required.');
    }

    const userData = AuthController.jwtService.verifyRefreshToken(refreshToken);
    const user = await AuthController.userService.getUserById(userData.id);

    const newAccessToken = AuthController.jwtService.generateAccessToken(user);
    const newRefreshToken =
      AuthController.jwtService.generateRefreshToken(user);

    return res
      .status(StatusCodes.OK)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  }
}
