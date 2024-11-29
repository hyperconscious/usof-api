import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { postService } from '../services/post.service';
import { UserRole } from '../entities/user.entity';
import { BadRequestError, ForbiddenError } from '../utils/http-errors';
import { QueryOptions } from '../utils/paginator';
import { queryOptionsDto } from '../dto/query-options.dto';

export class CommentController {
  private static CommentService = new CommentService();

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

  public static async getCommentById(req: Request, res: Response) {
    const commentId = parseInt(req.params.comment_id, 10);
    if (!commentId) {
      throw new BadRequestError('Comment Id is required');
    }
    const comment =
      await CommentController.CommentService.getCommentById(commentId);
    const post = await postService.getPostById(comment.post.id);
    if (
      post.status !== 'active' &&
      req.user?.role !== UserRole.Admin &&
      post.author.id !== req.user?.id
    ) {
      throw new ForbiddenError('You are not authorized to view this comment.');
    }
    return res.status(StatusCodes.OK).json(comment);
  }

  public static async getChildrenComments(req: Request, res: Response) {
    const queryOptions = CommentController.validateQueryDto(req);
    const commentId = parseInt(req.params.comment_id, 10);
    if (!commentId) {
      throw new BadRequestError('Comment Id is required');
    }
    const comments = await CommentController.CommentService.getChildrenComments(
      commentId,
      queryOptions,
    );
    return res.status(StatusCodes.OK).json(comments);
  }

  public static async getLikesByCommentId(req: Request, res: Response) {
    const commentId = parseInt(req.params.comment_id, 10);
    if (!commentId) {
      throw new BadRequestError('Comment Id is required');
    }
    const likes =
      await CommentController.CommentService.getLikesByCommentId(commentId);
    return res.status(StatusCodes.OK).json(likes);
  }

  public static async getDislikesByCommentId(req: Request, res: Response) {
    const commentId = parseInt(req.params.comment_id, 10);
    if (!commentId) {
      throw new BadRequestError('Comment Id is required');
    }
    const likes =
      await CommentController.CommentService.getDislikesByCommentId(commentId);
    return res.status(StatusCodes.OK).json(likes);
  }

  public static async AddLikeDislike(req: Request, res: Response) {
    const commentId = parseInt(req.params.comment_id, 10);
    if (!commentId) {
      throw new BadRequestError('Comment Id is required');
    }
    const comment =
      await CommentController.CommentService.getCommentById(commentId);
    if (comment.status !== 'active') {
      throw new ForbiddenError(
        'You are not authorized to like/dislike this comment.',
      );
    }
    const post = await postService.getPostById(comment.post.id);
    if (
      (post.status === 'locked' || post.status !== 'active') &&
      req.user?.role !== UserRole.Admin
    ) {
      throw new ForbiddenError(
        'Post is locked. You are not authorized to like/dislike this comment.',
      );
    }
    const like = await CommentController.CommentService.AddLikeDislike(
      commentId,
      req.user?.id!,
      req.body.type,
    );
    return res.status(StatusCodes.CREATED).json(like);
  }

  public static async updateComment(req: Request, res: Response) {
    const commentId = parseInt(req.params.comment_id, 10);
    if (!commentId) {
      throw new BadRequestError('Comment Id is required');
    }
    const comment =
      await CommentController.CommentService.getCommentById(commentId);
    if (
      comment.author.id !== req.user?.id &&
      req.user?.role !== UserRole.Admin
    ) {
      throw new ForbiddenError(
        'You are not authorized to update this comment.',
      );
    }
    const post = await postService.getPostById(comment.post.id);
    if (
      (post.status === 'locked' || post.status !== 'active') &&
      req.user?.role !== UserRole.Admin
    ) {
      throw new ForbiddenError(
        'Post is locked. You are not authorized to update this comment.',
      );
    }
    const updatedComment = await CommentController.CommentService.updateComment(
      commentId,
      req.body,
    );
    return res.status(StatusCodes.OK).json(updatedComment);
  }

  public static async deleteComment(req: Request, res: Response) {
    const commentId = parseInt(req.params.comment_id, 10);
    if (!commentId) {
      throw new BadRequestError('Comment Id is required');
    }
    const comment =
      await CommentController.CommentService.getCommentById(commentId);
    if (
      comment.author.id !== req.user?.id &&
      req.user?.role !== UserRole.Admin
    ) {
      throw new ForbiddenError(
        'You are not authorized to delete this comment.',
      );
    }
    const post = await postService.getPostById(comment.post.id);
    if (
      (post.status === 'locked' || post.status !== 'active') &&
      req.user?.role !== UserRole.Admin
    ) {
      throw new ForbiddenError(
        'Post is locked. You are not authorized to delete this comment.',
      );
    }
    await CommentController.CommentService.deleteComment(commentId);
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  private static async DeleteLikeDislike(
    req: Request,
    res: Response,
    type: 'like' | 'dislike',
  ) {
    const commentId = parseInt(req.params.comment_id, 10);
    if (!commentId) {
      throw new BadRequestError('Comment Id is required');
    }
    const comment =
      await CommentController.CommentService.getCommentById(commentId);
    if (comment.status !== 'active') {
      throw new ForbiddenError(
        'You are not authorized to like/dislike this comment.',
      );
    }
    const post = await postService.getPostById(comment.post.id);
    if (
      (post.status === 'locked' || post.status !== 'active') &&
      req.user?.role !== UserRole.Admin
    ) {
      throw new ForbiddenError(
        'Post is locked. You are not authorized to like/dislike this comment.',
      );
    }
    const like = await CommentController.CommentService.DeleteLikeDislike(
      commentId,
      req.user?.id!,
      type,
    );
    return res.status(StatusCodes.OK).json(like);
  }

  public static async DeleteLike(req: Request, res: Response) {
    return CommentController.DeleteLikeDislike(req, res, 'like');
  }

  public static async DeleteDislike(req: Request, res: Response) {
    return CommentController.DeleteLikeDislike(req, res, 'dislike');
  }

  public static async getUserReaction(req: Request, res: Response) {
    const commentId = parseInt(req.params.comment_id, 10);
    const userId = req.user?.id!;
    const reaction = await CommentController.CommentService.getUserReaction(
      commentId,
      userId,
    );
    return res.status(StatusCodes.OK).json({ reaction });
  }
}
