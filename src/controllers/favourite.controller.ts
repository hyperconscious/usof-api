import { FavouriteService } from '../services/favourite.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class FavouriteController {
  private static FavouriteService = new FavouriteService();

  public static async addFavorite(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json();
    }
    const favouriteData = req.body;
    const favourite = await FavouriteController.FavouriteService.addFavorite(
      userId,
      favouriteData,
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
    const favorites = await FavouriteController.FavouriteService.getFavorites(
      userId!,
    );
    return res.status(StatusCodes.OK).json(favorites);
  }
}
