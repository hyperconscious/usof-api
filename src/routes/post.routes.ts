import { Router, Request, Response } from 'express';
import { PostController } from '../controllers/post.controller';
import { auth } from '../middlewares/auth.middleware';

const postRouter = Router();

postRouter.get('/', PostController.getAllposts);
postRouter.get('/:post_id', PostController.getPostById);
postRouter.get('/:post_id/comments', PostController.getAllCommentsByPostId);
postRouter.get('/:post_id/categories', PostController.getAllCategories);
postRouter.get('/:post_id/likes', PostController.getAllLikes);

postRouter.post('/:post_id/comments', auth, PostController.createComment);
postRouter.post('/', auth, PostController.createPost);
postRouter.post('/:post_id/like', auth, PostController.handleLikeDislike);

postRouter.patch('/:post_id', auth, PostController.updatePost);

postRouter.delete('/:post_id', auth, PostController.deletePost);
postRouter.delete('/:post_id/like', auth, PostController.handleLikeDislike);

export default postRouter;
