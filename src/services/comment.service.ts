import { Repository } from 'typeorm';
import { AppDataSource } from '../config/orm.config';
import { BadRequestError, NotFoundError } from '../utils/http-errors';
import { Comment } from '../entities/comment.entity';
import { Like } from '../entities/like.entity';
import { UserService } from './user.service';
import { updateCommentDto } from '../dto/comment.dto';
import { PostService, postService } from './post.service';
import { Paginator, QueryOptions } from '../utils/paginator';

export class CommentService {
  private commentRepository: Repository<Comment>;
  private userService: UserService;
  private likeRepository: Repository<Like>;
  private postService: PostService;

  constructor() {
    this.commentRepository = AppDataSource.getRepository(Comment);
    this.userService = new UserService();
    this.likeRepository = AppDataSource.getRepository(Like);
    this.postService = new PostService();
  }

  private validateCommentDTO(commentData: Partial<Comment>): Comment {
    const { error, value: Comment } = updateCommentDto.validate(commentData, {
      abortEarly: false,
    });
    if (error) {
      throw new BadRequestError(
        error.details.map((detail) => detail.message).join('; '),
      );
    }
    return Comment;
  }

  public async getCommentById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['post'],
    });
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }
    return comment;
  }

  public async getChildrenComments(
    commentId: number,
    queryOptions: QueryOptions,
  ): Promise<{ items: Comment[]; total: number }> {
    const comment = await this.getCommentById(commentId);
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.parent = :commentId', { commentId });

    if (!queryOptions.sortField) {
      queryOptions.sortField = 'comment.likes_count';
    }

    const paginator = new Paginator<Comment>(queryOptions);
    return await paginator.paginate(queryBuilder);
  }

  public async getLikesByCommentId(commentId: number): Promise<Number> {
    return (await this.getCommentById(commentId)).likesCount;
  }

  public async getDislikesByCommentId(commentId: number): Promise<Number> {
    return (await this.getCommentById(commentId)).dislikesCount;
  }

  public async AddLikeDislike(
    commentId: number,
    userId: number,
    type: 'like' | 'dislike',
  ): Promise<Like> {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const comment = await this.getCommentById(commentId);
        const user = await this.userService.getUserById(userId);
        const likeRepository = transactionalEntityManager.getRepository(Like);

        const existingLike = await likeRepository.findOneBy({
          comment: { id: commentId },
          user: { id: userId },
          type,
        });
        if (existingLike) {
          throw new BadRequestError(`You have already ${type}d this comment`);
        }

        const oppositeType = type === 'like' ? 'dislike' : 'like';
        const oppositeLike = await likeRepository.findOneBy({
          comment: { id: commentId },
          user: { id: userId },
          type: oppositeType,
        });
        if (oppositeLike) {
          await transactionalEntityManager.remove(oppositeLike);
        }

        const newLike = likeRepository.create({
          comment,
          user,
          entityType: 'comment',
          type,
        });
        return await likeRepository.save(newLike);
      },
    );
  }

  public async DeleteLikeDislike(
    commentId: number,
    userId: number,
    type: 'like' | 'dislike',
  ): Promise<Like> {
    const comment = await this.getCommentById(commentId);
    const author = await this.userService.getUserById(userId);
    const existingLike = await this.likeRepository.findOneBy({
      comment: { id: commentId },
      user: { id: userId },
      type,
    });
    if (existingLike !== null) {
      this.likeRepository.remove(existingLike);
      return existingLike;
    }

    throw new BadRequestError(`You have not ${type}d this comment`);
  }

  public async updateComment(
    id: number,
    commentData: Partial<Comment>,
  ): Promise<Comment> {
    const comment = await this.getCommentById(id);
    const eligablePost = await this.postService.getPostById(comment.post.id);
    if (eligablePost.status !== 'active') {
      throw new BadRequestError('You can not update comment on inactive post');
    }
    const commentBody = this.validateCommentDTO(commentData);
    const updatedComment = this.commentRepository.merge(comment, commentBody);

    return this.commentRepository.save(updatedComment);
  }

  public async deleteComment(id: number): Promise<Comment> {
    const comment = await this.getCommentById(id);
    const childComments = await this.commentRepository.find({
      where: { parent: { id } },
    });

    for (const child of childComments) {
      await this.deleteComment(child.id);
    }

    await this.commentRepository.remove(comment);
    return comment;
  }

  public async getUserReaction(
    commentId: number,
    userId: number,
  ): Promise<Like | null> {
    const post = await this.getCommentById(commentId);
    const user = await this.userService.getUserById(userId);
    return await this.likeRepository.findOneBy({
      comment: { id: commentId },
      user: { id: userId },
    });
  }
}
