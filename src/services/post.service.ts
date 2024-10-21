import { In, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Category } from '../entities/category.entity';
import { Comment } from '../entities/comment.entity';
import { AppDataSource } from '../config/orm.config';
import { BadRequestError, NotFoundError } from '../utils/http-errors';
import { createPostDto, updatePostDto } from '../dto/post.dto';
import { ServiceMethod, UserService } from './user.service';
import { Paginator, QueryOptions } from '../utils/paginator';
import { CreateCommentDto } from '../dto/comment.dto';
import { Like } from '../entities/like.entity';
import { User } from '../entities/user.entity';

export class PostService {
  private postRepository: Repository<Post>;
  private categoryRepository: Repository<Category>;
  private commentRepository: Repository<Comment>;
  private likeRepository: Repository<Like>;
  private UserService: UserService;

  constructor() {
    this.postRepository = AppDataSource.getRepository(Post);
    this.categoryRepository = AppDataSource.getRepository(Category);
    this.commentRepository = AppDataSource.getRepository(Comment);
    this.likeRepository = AppDataSource.getRepository(Like);
    this.UserService = new UserService();
  }

  private validatePostDTO(
    postData: Partial<Post>,
    method: ServiceMethod,
  ): Post {
    const dto = method === ServiceMethod.create ? createPostDto : updatePostDto;
    const { error, value: Post } = dto.validate(postData, {
      abortEarly: false,
    });
    if (error) {
      throw new BadRequestError(
        error.details.map((detail) => detail.message).join('; '),
      );
    }
    return Post;
  }

  private validateCommentDTO(commentData: Partial<Comment>): Comment {
    const { error, value: Comment } = CreateCommentDto.validate(commentData, {
      abortEarly: false,
    });
    if (error) {
      throw new BadRequestError(
        error.details.map((detail) => detail.message).join('; '),
      );
    }
    return Comment;
  }

  public async createPost(postData: Partial<Post>): Promise<Post> {
    const post = this.validatePostDTO(postData, ServiceMethod.create);

    const categories = await this.categoryRepository.findBy({
      id: In(postData.categories?.map((c) => c.id) || []),
    });

    if (categories.length !== post.categories?.length) {
      throw new BadRequestError('One or more categories are invalid.');
    }

    const newPost = this.postRepository.create(post);
    return await this.postRepository.save(newPost);
  }

  public async updatePost(id: number, postData: Partial<Post>): Promise<Post> {
    const updatedPost = this.validatePostDTO(postData, ServiceMethod.update);

    const post = await this.getPostById(id);

    const categories = await this.categoryRepository.findBy({
      id: In(updatedPost.categories?.map((c) => c.id) || []),
    });

    if (categories.length !== updatedPost.categories?.length) {
      throw new BadRequestError('One or more categories are invalid.');
    }

    return await this.postRepository.merge(post, updatedPost);
  }

  public async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    return post;
  }

  public async getAllPosts(
    queryOptions: QueryOptions,
  ): Promise<{ data: Post[]; total: number }> {
    const queryBuilder = this.postRepository.createQueryBuilder('post');
    const paginator = new Paginator<Post>(queryOptions);
    return await paginator.paginate(queryBuilder);
  }

  public async getAllCommentsByPostId(
    postId: number,
    queryOptions: QueryOptions,
  ): Promise<{ data: Comment[]; total: number }> {
    const post = await this.getPostById(postId);
    const queryBuilder = this.postRepository
      .createQueryBuilder('comment')
      .where('comment.postId = :postId', { postId });
    const paginator = new Paginator<Comment>(queryOptions);
    return await paginator.paginate(queryBuilder);
  }

  public async deletePost(id: number): Promise<boolean> {
    const post = await this.getPostById(id);
    await this.postRepository.remove(post);
    return true;
  }

  public async createComment(
    postId: number,
    commentData: Partial<Comment>,
  ): Promise<Comment> {
    const post = await this.getPostById(postId);
    const comment = this.validateCommentDTO(commentData);
    const newComment = this.commentRepository.create({ ...comment, post });
    return await this.commentRepository.save(newComment);
  }

  public async getAllCategories(postId: number): Promise<Category[]> {
    const post = await this.getPostById(postId);
    return post.categories;
  }

  public async getAllLikes(postId: number): Promise<Number> {
    const post = await this.getPostById(postId);
    return post.likes;
  }

  public async handleLikeDislike(
    postId: number,
    userId: number,
    type: 'like' | 'dislike',
  ): Promise<Like> {
    const post = await this.getPostById(postId);
    const author = await this.UserService.getUserById(userId);
    const existingLike = await this.likeRepository.findOneBy({
      post: { id: postId },
      author: { id: userId },
      type,
    });
    if (existingLike !== null) {
      this.likeRepository.remove(existingLike);
      return existingLike;
    }
    const oppositeType = type === 'like' ? 'dislike' : 'like';
    const oppositeLike = await this.likeRepository.findOneBy({
      post: { id: postId },
      author: { id: userId },
      type: oppositeType,
    });
    if (oppositeLike) {
      await this.likeRepository.remove(oppositeLike);
    }
    const newLike = this.likeRepository.create({
      post,
      author,
      entityType: 'post',
      type,
    });
    await this.likeRepository.save(newLike);
    return newLike;
  }
}

export const postService = new PostService();
