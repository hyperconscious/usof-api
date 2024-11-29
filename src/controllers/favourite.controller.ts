import { FavouriteService } from '../services/favourite.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PostController } from './post.controller';
import { QueryOptions, queryOptionsDto } from '../dto/query-options.dto';
import { BadRequestError } from '../utils/http-errors';
import { UserRole } from '../entities/user.entity';

export class FavouriteController {
  private static FavouriteService = new FavouriteService();

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

  public static async addFavorite(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json();
    }
    const postId = req.body;
    const favourite = await FavouriteController.FavouriteService.addFavorite(
      userId,
      postId,
    );
    return res.status(StatusCodes.CREATED).json(favourite);
  }

  public static async removeFavorite(req: Request, res: Response) {
    const userId = req.user?.id;
    const postId = parseInt(req.params.post_id, 10);
    await FavouriteController.FavouriteService.removeFavorite(userId!, postId);
    return res.status(StatusCodes.NO_CONTENT).json();
  }

  public static async getFavorites(req: Request, res: Response) {
    const userId = req.user?.id;
    const queryOptions = FavouriteController.validateQueryDto(req);
    queryOptions.sortField = queryOptions.sortField || 'likes_count';
    queryOptions.searchType = 'post';
    if (req.user?.role !== UserRole.Admin) {
      queryOptions.filters = {
        ...queryOptions.filters,
        status: 'active',
      };
    }
    const favorites = await FavouriteController.FavouriteService.getFavorites(
      userId!,
      queryOptions,
    );
    return res.status(StatusCodes.OK).json(favorites);
  }

  public static async getFavorite(req: Request, res: Response) {
    const userId = req.user?.id;
    const postId = parseInt(req.params.post_id, 10);
    const favorite = await FavouriteController.FavouriteService.getUserBookmark(
      userId!,
      postId,
    );
    return res.status(StatusCodes.OK).json(favorite);
  }
}
