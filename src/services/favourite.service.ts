import { In, Not, Repository } from 'typeorm';
import { Favorite } from '../entities/favoutite.entity';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { AppDataSource } from '../config/orm.config';
import { BadRequestError, NotFoundError } from '../utils/http-errors';
import { createFavouriteDto } from '../dto/favourite.dto';
import { FavouriteController } from '../controllers/favourite.controller';
import { Paginator, QueryOptions } from '../utils/paginator';
import { PostController } from '../controllers/post.controller';
import { postService } from './post.service';

export class FavouriteService {
  private favouriteRepository: Repository<Favorite>;
  private userRepositroy: Repository<User>;
  private postRepository: Repository<Post>;

  constructor() {
    this.favouriteRepository = AppDataSource.getRepository(Favorite);
    this.userRepositroy = AppDataSource.getRepository(User);
    this.postRepository = AppDataSource.getRepository(Post);
  }

  private validateFavouriteDTO(favouriteData: Partial<Favorite>): Favorite {
    const { error, value: favourite } = createFavouriteDto.validate(
      favouriteData,
      {
        abortEarly: false,
      },
    );
    if (error) {
      throw new BadRequestError(
        error.details.map((detail) => detail.message).join('; '),
      );
    }
    return favourite;
  }

  async addFavorite(userId: number, data: any): Promise<Favorite> {
    const post = await this.postRepository.findOneBy({ id: data.postId });
    const user = await this.userRepositroy.findOneBy({ id: userId });

    if (!user || !post) {
      throw new NotFoundError('User or Post not found');
    }

    const favouriteToSave = this.favouriteRepository.create({ user, post });
    return await this.favouriteRepository.save(favouriteToSave);
  }

  async removeFavorite(userId: number, postId: number): Promise<void> {
    const favorite = await this.favouriteRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (!favorite) {
      throw new NotFoundError('Favorite not found');
    }

    await this.favouriteRepository.remove(favorite);
  }

  async getFavorites(
    userId: number,
    queryOptions: QueryOptions,
  ): Promise<{ items: Post[]; total: number }> {
    const queryBuilder = this.favouriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.post', 'post')
      .leftJoinAndSelect('post.author', 'author')
      .where('favorite.user_id = :userId', { userId });

    const paginator = new Paginator<Post>(queryOptions);
    const result = paginator.paginate(queryBuilder);
    const paginatedResult = (await result) as any;
    paginatedResult.items = paginatedResult.items.map(
      (favorite: Favorite) => favorite.post,
    );
    return paginatedResult;
  }

  public async getUserBookmark(
    userId: number,
    postId: number,
  ): Promise<Favorite | null> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    const user = await this.userRepositroy.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return await this.favouriteRepository.findOneBy({
      post: { id: postId },
      user: { id: userId },
    });
  }
}
