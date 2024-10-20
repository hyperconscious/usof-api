import { In, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Category } from '../entities/category.entity';
import { AppDataSource } from '../config/orm.config';
import { BadRequestError, NotFoundError } from '../utils/http-errors';
import { createPostDto, updatePostDto } from '../dto/post.dto';
import { ServiceMethod } from './user.service';
import {
  PaginationOptions,
  SortOptions,
  FilterOptions,
  Paginator,
} from '../utils/paginator';

export class PostService {
  private postRepository: Repository<Post>;
  private categoryRepository: Repository<Category>;

  constructor() {
    this.postRepository = AppDataSource.getRepository(Post);
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  private validatePostDTO(postData: Partial<Post>, method: ServiceMethod) {
    const dto = method === ServiceMethod.create ? createPostDto : updatePostDto;
    const { error } = dto.validate(postData, { abortEarly: false });

    if (error) {
      throw new BadRequestError(
        error.details.map((detail) => detail.message).join('; '),
      );
    }
  }

  public async createPost(postData: Partial<Post>): Promise<Post> {
    this.validatePostDTO(postData, ServiceMethod.create);

    const categories = await this.categoryRepository.findBy({
      id: In(postData.categories?.map((c) => c.id) || []),
    });

    if (categories.length !== postData.categories?.length) {
      throw new BadRequestError('One or more categories are invalid.');
    }

    const newPost = this.postRepository.create(postData);
    return await this.postRepository.save(newPost);
  }

  public async updatePost(id: number, postData: Partial<Post>): Promise<Post> {
    this.validatePostDTO(postData, ServiceMethod.update);

    const post = await this.getPostById(id);

    const categories = await this.categoryRepository.findBy({
      id: In(postData.categories?.map((c) => c.id) || []),
    });

    if (categories.length !== postData.categories?.length) {
      throw new BadRequestError('One or more categories are invalid.');
    }

    return await this.postRepository.save({ ...post, ...postData });
  }

  public async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    return post;
  }

  public async getAllPosts(
    PaginationOptions: PaginationOptions,
    SortOptions: SortOptions | undefined,
    FilterOptions: FilterOptions | undefined,
  ): Promise<{ data: Post[]; total: number }> {
    const queryBuilder = this.postRepository.createQueryBuilder('post');
    const paginator = new Paginator<Post>(
      PaginationOptions,
      SortOptions,
      FilterOptions,
    );

    return await paginator.paginate(queryBuilder);
  }
}
