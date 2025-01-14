import { Router, Request, Response } from 'express';
import { PostController } from '../controllers/post.controller';
import { auth, authorizeUser } from '../middlewares/auth.middleware';
import { uploadMultiple } from '../config/file-upload.config';

const postRouter = Router();

postRouter.get('/', authorizeUser, PostController.getAllPosts);
postRouter.post('/', auth, uploadMultiple, PostController.createPost);

postRouter.get('/my-posts', auth, PostController.getMyPosts);

postRouter.get('/:post_id', authorizeUser, PostController.getPostById);
postRouter.patch('/:post_id', auth, uploadMultiple, PostController.updatePost);
postRouter.delete('/:post_id', auth, PostController.deletePost);

postRouter.get(
  '/:post_id/comments',
  authorizeUser,
  PostController.getAllCommentsByPostId,
);
postRouter.post('/:post_id/comments', auth, PostController.createComment);

postRouter.post('/:post_id/like', auth, PostController.AddLikeDislike);
postRouter.delete('/:post_id/like', auth, PostController.DeleteLike);
postRouter.delete('/:post_id/dislike', auth, PostController.DeleteDislike);

postRouter.get(
  '/:post_id/categories',
  authorizeUser,
  PostController.getAllCategories,
);

postRouter.get('/:post_id/likes', authorizeUser, PostController.getAllLikes);
postRouter.get(
  '/:post_id/dislikes',
  authorizeUser,
  PostController.getAllDislikes,
);

postRouter.get(
  '/:post_id/categories',
  authorizeUser,
  PostController.getAllCategories,
);

postRouter.get(
  '/:post_id/user-reaction',
  authorizeUser,
  PostController.getUserReaction,
);

export default postRouter;
