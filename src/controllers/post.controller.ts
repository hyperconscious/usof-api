import { Request, Response } from 'express';
import { QueryOptions, queryOptionsDto } from '../dto/query-options.dto';
import { PostService } from '../services/post.service';
import { BadRequestError, ForbiddenError } from '../utils/http-errors';
import { StatusCodes } from 'http-status-codes';
import { UserRole } from '../entities/user.entity';

export class PostController {
  private static postService = new PostService();

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

  public static async getAllPosts(req: Request, res: Response) {
    const queryOptions = PostController.validateQueryDto(req);
    queryOptions.sortField = queryOptions.sortField || 'likes_count';
    queryOptions.searchType = 'post';
    if (req.user?.role !== UserRole.Admin) {
      queryOptions.filters = {
        ...queryOptions.filters,
        status: 'active',
      };
    }
    const posts = await PostController.postService.getAllPosts(queryOptions);
    return res.status(StatusCodes.OK).json(posts);
  }

  public static async getMyPosts(req: Request, res: Response) {
    const queryOptions = PostController.validateQueryDto(req);
    queryOptions.sortField = queryOptions.sortField || 'likes_count';
    queryOptions.searchType = 'post';
    queryOptions.filters = {
      ...queryOptions.filters,
      postAuthor: { id: req.user?.id! },
    };
    const posts = await PostController.postService.getAllPosts(queryOptions);
    return res.status(StatusCodes.OK).json(posts);
  }

  public static async getPostById(req: Request, res: Response) {
    const postId = parseInt(req.params.post_id, 10);
    const post = await PostController.postService.getPostById(postId);
    if (
      post.status !== 'active' &&
      req.user?.role !== UserRole.Admin &&
      post.author.id !== req.user?.id
    ) {
      throw new ForbiddenError('You are not authorized to view this post.');
    }
    return res.status(StatusCodes.OK).json({ data: post });
  }

  public static async getAllCommentsByPostId(req: Request, res: Response) {
    const queryOptions = PostController.validateQueryDto(req);
    const postId = parseInt(req.params.post_id, 10);
    const post = await PostController.postService.getPostById(postId);
    if (
      post.status !== 'active' &&
      req.user?.role !== UserRole.Admin &&
      post.author.id !== req.user?.id
    ) {
      throw new ForbiddenError(
        'You are not authorized to view these comments.',
      );
    }
    if (req.user?.role !== UserRole.Admin) {
      queryOptions.filters = {
        ...queryOptions.filters,
        status: 'active',
      };
    }
    queryOptions.searchType = 'comment';
    const comments = await PostController.postService.getAllCommentsByPostId(
      postId,
      queryOptions,
    );
    return res.status(StatusCodes.OK).json(comments);
  }

  public static async createComment(req: Request, res: Response) {
    const postId = parseInt(req.params.post_id, 10);
    const post = await PostController.postService.getPostById(postId);
    if (
      post.status !== 'active' &&
      req.user?.role !== UserRole.Admin &&
      post.author.id !== req.user?.id
    ) {
      throw new ForbiddenError(
        'You are not authorized to create comment on this post.',
      );
    }
    if (post.status === 'locked' && req.user?.role !== UserRole.Admin) {
      throw new ForbiddenError(
        'Post is locked. You are not authorized to create comment on this post.',
      );
    }
    const comment = await PostController.postService.createComment(
      postId,
      req.user?.id!,
      req.body,
      req.body.parentCommentId,
    );

    return res.status(StatusCodes.CREATED).json({ data: comment });
  }

  public static async getAllCategories(req: Request, res: Response) {
    const postId = parseInt(req.params.post_id, 10);
    const post = await PostController.postService.getPostById(postId);
    if (
      post.status !== 'active' &&
      req.user?.role !== UserRole.Admin &&
      post.author.id !== req.user?.id
    ) {
      throw new ForbiddenError(
        'You are not authorized to see this post categories.',
      );
    }
    const categories =
      await PostController.postService.getAllCategories(postId);
    return res.status(StatusCodes.OK).json(categories);
  }

  public static async getAllLikes(req: Request, res: Response) {
    const postId = parseInt(req.params.post_id, 10);
    const post = await PostController.postService.getPostById(postId);
    if (
      post.status !== 'active' &&
      req.user?.role !== UserRole.Admin &&
      post.author.id !== req.user?.id
    ) {
      throw new ForbiddenError(
        'You are not authorized to see this post likes.',
      );
    }
    const likes = await PostController.postService.getAllLikes(postId);
    return res.status(StatusCodes.OK).json(likes);
  }

  public static async getAllDislikes(req: Request, res: Response) {
    const postId = parseInt(req.params.post_id, 10);
    const post = await PostController.postService.getPostById(postId);
    if (
      post.status !== 'active' &&
      req.user?.role !== UserRole.Admin &&
      post.author.id !== req.user?.id
    ) {
      throw new ForbiddenError(
        'You are not authorized to see this post dislikes.',
      );
    }
    const likes = await PostController.postService.getAllDislikes(postId);
    return res.status(StatusCodes.OK).json(likes);
  }

  public static async createPost(req: Request, res: Response) {
    if (req.files) {
      req.body.images = (req.files as Express.Multer.File[]).map(
        (file) => file.path,
      );
    }
    const post = await PostController.postService.createPost({
      ...req.body,
      author: { id: req.user?.id! },
    });
    return res.status(StatusCodes.CREATED).json({ data: post });
  }

  public static async AddLikeDislike(req: Request, res: Response) {
    const postId = parseInt(req.params.post_id, 10);
    const post = await PostController.postService.getPostById(postId);
    if (
      (post.status === 'locked' || post.status === 'inactive') &&
      req.user?.role !== UserRole.Admin
    ) {
      throw new ForbiddenError(
        'Post is locked. You are not authorized to create like on this post.',
      );
    }
    if (
      post.status !== 'active' &&
      req.user?.role !== UserRole.Admin &&
      post.author.id !== req.user?.id
    ) {
      throw new ForbiddenError(
        'You are not authorized to create comment on this post.',
      );
    }
    const like = await PostController.postService.AddLikeDislike(
      postId,
      req.user?.id!,
      req.body.type,
    );
    return res.status(StatusCodes.OK).json({ data: like });
  }

  private static async DeleteLikeDislike(
    req: Request,
    res: Response,
    type: 'like' | 'dislike',
  ) {
    const postId = parseInt(req.params.post_id, 10);
    const post = await PostController.postService.getPostById(postId);
    if (post.status === 'locked' && req.user?.role !== UserRole.Admin) {
      throw new ForbiddenError(
        'Post is locked. You are not authorized to delete like on this post.',
      );
    }
    if (
      post.status !== 'active' &&
      req.user?.role !== UserRole.Admin &&
      post.author.id !== req.user?.id
    ) {
      throw new ForbiddenError(
        'You are not authorized to create comment on this post.',
      );
    }
    const like = await PostController.postService.DeleteLikeDislike(
      postId,
      req.user?.id!,
      type,
    );
    return res.status(StatusCodes.OK).json({ data: like });
  }

  public static async DeleteLike(req: Request, res: Response) {
    return PostController.DeleteLikeDislike(req, res, 'like');
  }

  public static async DeleteDislike(req: Request, res: Response) {
    return PostController.DeleteLikeDislike(req, res, 'dislike');
  }

  public static async updatePost(req: Request, res: Response) {
    const postId = parseInt(req.params.post_id, 10);
    const userId = req.user?.id!;
    const post = await PostController.postService.getPostById(postId);
    if (post.author.id !== userId && req.user?.role! !== UserRole.Admin) {
      throw new ForbiddenError('You are not authorized to update this post.');
    }
    if (req.files) {
      req.body.images = (req.files as Express.Multer.File[]).map(
        (file) => file.path,
      );
    }
    const updatedPost = await PostController.postService.updatePost(
      postId,
      req.body,
    );
    return res.status(StatusCodes.OK).json({ data: updatedPost });
  }

  public static async deletePost(req: Request, res: Response) {
    const postId = parseInt(req.params.post_id, 10);
    const userId = req.user?.id!;
    const post = await PostController.postService.getPostById(postId);
    if (post.author.id !== userId && req.user?.role! !== UserRole.Admin) {
      throw new ForbiddenError('You are not authorized to delete this post.');
    }
    await PostController.postService.deletePost(postId);
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  public static async getUserReaction(req: Request, res: Response) {
    const postId = parseInt(req.params.post_id, 10);
    const userId = req.user?.id!;
    const reaction = await PostController.postService.getUserReaction(
      postId,
      userId,
    );
    return res.status(StatusCodes.OK).json({ reaction });
  }
}
