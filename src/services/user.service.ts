import { Repository } from 'typeorm';
import { BadRequestError, NotFoundError } from '../utils/http-errors';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../config/orm.config';
import { createUserDto, updateUserDto } from '../dto/user.dto';
import { Paginator, QueryOptions } from '../utils/paginator';
import { Like } from '../entities/like.entity';
import { Post, PostStatus } from '../entities/post.entity';
import { queryOptionsDto } from '../dto/query-options.dto';
import { query } from 'express';
import { Comment } from '../entities/comment.entity';
import { Favorite } from '../entities/favoutite.entity';

export const enum ServiceMethod {
  update,
  create,
}

export class UserService {
  private userRepository: Repository<User>;
  private likeRepository: Repository<Like>;
  private postRepository: Repository<Post>;
  private commentRepository: Repository<Comment>;
  private favouriteRepository: Repository<Favorite>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.likeRepository = AppDataSource.getRepository(Like);
    this.postRepository = AppDataSource.getRepository(Post);
    this.commentRepository = AppDataSource.getRepository(Comment);
    this.favouriteRepository = AppDataSource.getRepository(Favorite);
  }

  private validateUserDTO(userData: Partial<User>, method: ServiceMethod) {
    const dto = method === ServiceMethod.create ? createUserDto : updateUserDto;
    const { error } = dto.validate(userData, { abortEarly: false });

    if (error) {
      throw new BadRequestError(
        error.details.map((detail) => detail.message).join('; '),
      );
    }
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
      throw new BadRequestError(errors.join('\n'));
    }

    newUser.hashPassword();

    return this.userRepository.save(newUser);
  }

  public async updateUser(id: number, userData: Partial<User>): Promise<User> {
    this.validateUserDTO(userData, ServiceMethod.update);

    const user = await this.getUserById(id);

    if (userData.password) {
      user.password = userData.password;
      user.hashPassword();
      userData.password = user.password;
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

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  public async getUserByEmailSafe(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  public async getUserByLogin(login: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ login });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  public async getUserByLoginSafe(login: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ login });
  }

  public async getAllLikedPosts(
    userId: number,
    queryOptions: QueryOptions,
  ): Promise<{ items: Post[]; total: number }> {
    queryOptions.searchType = 'user';
    queryOptions.sortField = 'publish_date';
    const queryBuilder = this.likeRepository
      .createQueryBuilder('like')
      .leftJoinAndSelect('like.post', 'post')
      .leftJoinAndSelect('post.author', 'author')
      .where('like.user_id = :userId', { userId })
      .andWhere('like.type = :type', { type: 'like' });

    const paginator = new Paginator<Post>(queryOptions);
    const result = paginator.paginate(queryBuilder);
    const paginatedResult = (await result) as any;
    paginatedResult.items = paginatedResult.items.map(
      (like: Like) => like.post,
    );
    return paginatedResult;
  }

  public async getAllUsers(
    queryOptions: QueryOptions,
  ): Promise<{ items: User[]; total: number }> {
    queryOptions.searchType = 'user';
    queryOptions.sortField = queryOptions.sortField || 'publisher_rating';
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const paginator = new Paginator<User>(queryOptions);
    return await paginator.paginate(queryBuilder);
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

    throw new BadRequestError('Invalid login or password.');
  }

  public async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await this.getUserById(id);
      await this.likeRepository.delete({ user: { id: user.id } });
      await this.favouriteRepository.delete({ user: { id: user.id } });
      await this.commentRepository.delete({ author: { id: user.id } });
      const posts = await this.postRepository.find({
        where: { author: { id: user.id } },
      });
      for (const post of posts) {
        await this.commentRepository.delete({ post: { id: post.id } });
      }
      await this.postRepository.delete({ author: { id: user.id } });
      await this.userRepository.remove(user);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Unable to delete user due to existing dependencies.');
    }
  }
}
