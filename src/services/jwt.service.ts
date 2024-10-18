import jwt from 'jsonwebtoken';
import { BadRequestError, UnauthorizedError } from '../utils/http-errors';
import { User } from '../entities/user.entity';
import config from '../config/env.config';

export class JWTService {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  private emailTokenSecret: string;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;
  private mailTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = config.JWT.accessTokenSecret;
    this.refreshTokenSecret = config.JWT.refreshTokenSecret;
    this.emailTokenSecret = config.JWT.emailTokenSecret;

    this.accessTokenExpiry = config.JWT.accessTokenExpiry;
    this.refreshTokenExpiry = config.JWT.refreshTokenExpiry;
    this.mailTokenExpiry = config.JWT.emailTokenExpiry;
  }

  public generateAccessToken(user: User): string {
    return jwt.sign({ id: user.id, role: user.role }, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  public generateRefreshToken(user: User): string {
    return jwt.sign({ id: user.id, role: user.role }, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    });
  }

  public generateEmailToken(user: User): string {
    return jwt.sign({ id: user.id, email: user.email }, this.emailTokenSecret, {
      expiresIn: this.mailTokenExpiry,
    });
  }

  public verifyAccessToken(token: string): User {
    try {
      return jwt.verify(token, this.accessTokenSecret) as User;
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired access token.');
    }
  }

  public verifyRefreshToken(token: string): User {
    try {
      return jwt.verify(token, this.refreshTokenSecret) as User;
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token.');
    }
  }

  public verifyEmailToken(token: string): User {
    try {
      return jwt.verify(token, this.emailTokenSecret) as User;
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired email token.');
    }
  }
}
