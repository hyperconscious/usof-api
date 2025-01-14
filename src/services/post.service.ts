import { In, Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Category } from '../entities/category.entity';
import { Comment } from '../entities/comment.entity';
import { AppDataSource } from '../config/orm.config';
import { BadRequestError, NotFoundError } from '../utils/http-errors';
import { createPostDto, updatePostDto } from '../dto/post.dto';
import { ServiceMethod, UserService } from './user.service';
import { Paginator } from '../utils/paginator';
import { QueryOptions } from '../dto/query-options.dto';
import { createCommentDto } from '../dto/comment.dto';
import { Like } from '../entities/like.entity';
import { Favorite } from '../entities/favoutite.entity';

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
    const { error, value: Comment } = createCommentDto.validate(commentData, {
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

    const user = await this.UserService.getUserById(postData.author?.id!);

    const categories = await this.categoryRepository.findBy({
      title: In(postData.categories || []),
    });

    if (categories.length !== postData.categories?.length) {
      throw new BadRequestError('One or more categories are invalid.');
    }

    const newPost = this.postRepository.create(post);
    newPost.categories = categories;
    newPost.author = user;
    return await this.postRepository.save(newPost);
  }

  public async updatePost(id: number, postData: Partial<Post>): Promise<Post> {
    const updatedPost = this.validatePostDTO(postData, ServiceMethod.update);

    const post = await this.getPostById(id);

    if (updatedPost.categories) {
      const categories = await this.categoryRepository.findBy({
        title: In(postData.categories || []),
      });

      if (categories.length !== updatedPost.categories?.length) {
        throw new BadRequestError('One or more categories are invalid.');
      }
      updatedPost.categories = categories;
      post.categories = updatedPost.categories;
    }

    const mergedPost = this.postRepository.merge(post, updatedPost);
    return await this.postRepository.save(mergedPost);
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
  ): Promise<{ items: Post[]; total: number }> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.categories', 'category');

    const paginator = new Paginator<Post>(queryOptions);
    const result = paginator.paginate(queryBuilder);
    const paginatedResult = await result;
    const postIds = paginatedResult.items.map((post) => post.id);
    const postsWithAllCategories = await this.postRepository.find({
      where: { id: In(postIds) },
      relations: ['categories'],
    });
    paginatedResult.items = paginatedResult.items.map((post) => ({
      ...post,
      categories:
        postsWithAllCategories.find((p) => p.id === post.id)?.categories || [],
    }));
    return paginatedResult;
  }

  public async getAllCommentsByPostId(
    postId: number,
    queryOptions: QueryOptions,
  ): Promise<{ items: Comment[]; total: number }> {
    const post = await this.getPostById(postId);
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.post.id = :postId', { postId })
      .andWhere('comment.parent IS NULL');

    if (!queryOptions.sortField) {
      queryOptions.sortField = 'comment.likes_count';
    }

    const paginator = new Paginator<Comment>(queryOptions);
    return await paginator.paginate(queryBuilder);
  }

  public async deletePost(id: number): Promise<boolean> {
    const post = await this.getPostById(id);
    const favourites = await this.likeRepository.findBy({ post: { id } });
    await this.likeRepository.remove(favourites);
    await this.postRepository.remove(post);
    return true;
  }

  public async createComment(
    postId: number,
    authorId: number,
    commentData: Partial<Comment>,
    parentCommentId?: number,
  ): Promise<Comment> {
    const post = await this.getPostById(postId);
    if (post.status !== 'active') {
      throw new BadRequestError('You can not comment on inactive post');
    }
    const author = await this.UserService.getUserById(authorId);
    const comment = this.validateCommentDTO(commentData);

    const newCommentData: Comment = {
      ...comment,
      post,
      author,
    };

    if (parentCommentId) {
      const parentComment = await this.commentRepository.findOneBy({
        id: parentCommentId,
      });
      if (!parentComment) {
        throw new BadRequestError('Parent comment not found');
      }
      newCommentData.parent = parentComment;
    }

    const newComment = this.commentRepository.create(newCommentData);
    return await this.commentRepository.save(newComment);
  }

  public async getAllCategories(postId: number): Promise<Category[]> {
    const post = await this.getPostById(postId);
    return post.categories;
  }

  public async getAllLikes(postId: number): Promise<Number> {
    const post = await this.getPostById(postId);
    return post.likesCount;
  }

  public async getAllDislikes(postId: number): Promise<Number> {
    const post = await this.getPostById(postId);
    return post.dislikesCount;
  }

  public async AddLikeDislike(
    postId: number,
    userId: number,
    type: 'like' | 'dislike',
  ): Promise<Like> {
    const post = await this.getPostById(postId);
    const user = await this.UserService.getUserById(userId);
    const existingLike = await this.likeRepository.findOneBy({
      post: { id: postId },
      user: { id: userId },
      type,
    });
    if (existingLike !== null) {
      throw new BadRequestError(`You have already ${type}d this post`);
    }
    const oppositeType = type === 'like' ? 'dislike' : 'like';
    const oppositeLike = await this.likeRepository.findOneBy({
      post: { id: postId },
      user: { id: userId },
      type: oppositeType,
    });
    if (oppositeLike) {
      this.DeleteLikeDislike(postId, userId, oppositeType);
    }
    const newLike = this.likeRepository.create({
      post,
      user,
      entityType: 'post',
      type,
    });
    await this.likeRepository.save(newLike);
    return newLike;
  }

  public async DeleteLikeDislike(
    postId: number,
    userId: number,
    type: 'like' | 'dislike',
  ): Promise<Like> {
    const post = await this.getPostById(postId);
    const author = await this.UserService.getUserById(userId);
    const existingLike = await this.likeRepository.findOneBy({
      post: { id: postId },
      user: { id: userId },
      type,
    });
    if (existingLike !== null) {
      this.likeRepository.remove(existingLike);
      return existingLike;
    }

    throw new BadRequestError(`You have not ${type}d this post`);
  }

  public async getUserReaction(
    postId: number,
    userId: number,
  ): Promise<Like | null> {
    const post = await this.getPostById(postId);
    const user = await this.UserService.getUserById(userId);
    return await this.likeRepository.findOneBy({
      post: { id: postId },
      user: { id: userId },
    });
  }
}

export const postService = new PostService();
