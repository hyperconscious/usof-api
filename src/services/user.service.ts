import { Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../config/ormconfig';
import { createUserDto, updateUserDto } from '../dto/user.dto';

export const enum ServiceMethod {
  update,
  create,
}

export class UserService {
  private userRepository: Repository<User>;

  private validateUserDTO(userData: Partial<User>, method: ServiceMethod) {
    const dto = method === ServiceMethod.create ? createUserDto : updateUserDto;
    const { error } = dto.validate(userData, { abortEarly: false });

    if (error) {
      throw new BadRequestError(
        error.details.map((detail) => detail.message).join('; '),
      );
    }
  }

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  public async findByEmailOrLogin(
    email: string,
    login: string,
  ): Promise<User | null> {
    return await this.userRepository.findOne({
      where: [{ email }, { login }],
    });
  }

  public async createUser(userData: Partial<User>): Promise<User> {
    this.validateUserDTO(userData, ServiceMethod.create);

    const newUser = this.userRepository.create(userData);

    const existingUser = await this.userRepository.findOne({
      where: [{ email: newUser.email }, { login: newUser.login }],
    });

    if (existingUser) {
      const errors = [];
      if (existingUser.email === newUser.email) {
        errors.push('Email already exists.');
      }
      if (existingUser.login === newUser.login) {
        errors.push('Login already exists.');
      }
      throw new BadRequestError(errors.join(' '));
    }

    newUser.hashPassword();

    return this.userRepository.save(newUser);
  }

  public async updateUser(id: number, userData: Partial<User>): Promise<User> {
    this.validateUserDTO(userData, ServiceMethod.update);

    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const updatedUser = this.userRepository.merge(user, userData);

    return this.userRepository.save(updatedUser);
  }

  public async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async validateUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.login = :loginOrEmail OR user.email = :loginOrEmail', {
        loginOrEmail,
      })
      .getOne();

    if (user && user.comparePassword(password)) {
      return user;
    }

    throw new BadRequestError('Invalid credentials.');
  }

  public async deleteUser(id: number): Promise<boolean> {
    const user = await this.getUserById(id);

    await this.userRepository.remove(user);
    return true;
  }
}
