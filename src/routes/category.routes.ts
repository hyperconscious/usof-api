import { Router, Request, Response } from 'express';
import { CategoryController } from '../controllers/categoty.controller';
import { auth, authorizeRole } from '../middlewares/auth.middleware';
import { UserRole } from '../entities/user.entity';

const categoryRoutes = Router();

categoryRoutes.get('/', CategoryController.getAllCategories);
categoryRoutes.post(
  '/',
  auth,
  authorizeRole(UserRole.Admin),
  CategoryController.createCategory,
);
categoryRoutes.get('/:category_id', CategoryController.getCategoryById);
categoryRoutes.patch(
  '/:category_id',
  auth,
  authorizeRole(UserRole.Admin),
  CategoryController.updateCategory,
);
categoryRoutes.delete(
  '/:category_id',
  auth,
  authorizeRole(UserRole.Admin),
  CategoryController.deleteCategory,
);

export default categoryRoutes;
