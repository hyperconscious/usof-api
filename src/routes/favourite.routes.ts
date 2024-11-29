import { Router } from 'express';
import { FavouriteController } from '../controllers/favourite.controller';
import { auth } from '../middlewares/auth.middleware';

const favouriteRoutes = Router();

favouriteRoutes.get('/', auth, FavouriteController.getFavorites);
favouriteRoutes.get('/:post_id', auth, FavouriteController.getFavorite);
favouriteRoutes.post('/', auth, FavouriteController.addFavorite);
favouriteRoutes.delete('/:post_id', auth, FavouriteController.removeFavorite);

export default favouriteRoutes;
