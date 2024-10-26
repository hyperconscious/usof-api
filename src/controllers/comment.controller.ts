import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { postService } from '../services/post.service';
import { UserRole } from '../entities/user.entity';
import { BadRequestError, ForbiddenError } from '../utils/http-errors';

export class CommentController {
  private static CommentService = new CommentService();

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
    await CommentController.CommentService.deleteComment(commentId);
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  public static async DeleteLikeDislike(req: Request, res: Response) {
    const commentId = parseInt(req.params.comment_id, 10);
    if (!commentId) {
      throw new BadRequestError('Comment Id is required');
    }
    const like = await CommentController.CommentService.DeleteLikeDislike(
      commentId,
      req.user?.id!,
      req.body.type,
    );
    return res.status(StatusCodes.OK).json(like);
  }
}
