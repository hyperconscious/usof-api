import { Not, Repository } from 'typeorm';
import { Favorite } from '../entities/favoutite.entity';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { AppDataSource } from '../config/orm.config';
import { BadRequestError, NotFoundError } from '../utils/http-errors';
import { createFavouriteDto } from '../dto/favourite.dto';

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

  async addFavorite(
    userId: number,
    favoriteData: Partial<Favorite>,
  ): Promise<Favorite> {
    const favourite = this.validateFavouriteDTO(favoriteData);
    const user = await this.userRepositroy.findOneByOrFail({ id: userId });
    const post = await this.postRepository.findOneBy({
      id: favourite.post as unknown as number,
    });

    if (!user || !post) {
      throw new NotFoundError('User or Post not found');
    }

    const favouriteToSave = this.favouriteRepository.create(favourite);
    favouriteToSave.user = user;
    favouriteToSave.post = post;

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

  async getFavorites(userId: number): Promise<Favorite[]> {
    return await this.favouriteRepository.find({
      where: { user: { id: userId } },
      relations: ['post'],
    });
  }
}
