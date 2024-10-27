import { Router, Request, Response } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { auth, authorizeRole } from '../middlewares/auth.middleware';

const commentRoutes = Router();

commentRoutes.get('/:comment_id', CommentController.getCommentById);
commentRoutes.get('/:comment_id/like', CommentController.getLikesByCommentId);
commentRoutes.get(
  '/:comment_id/dislike',
  CommentController.getDislikesByCommentId,
);
commentRoutes.post('/:comment_id/like', auth, CommentController.AddLikeDislike);
commentRoutes.patch('/:comment_id', auth, CommentController.updateComment);
commentRoutes.delete('/:comment_id', auth, CommentController.deleteComment);

export default commentRoutes;