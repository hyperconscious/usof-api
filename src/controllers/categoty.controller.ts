import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { PostController } from './post.controller';
import { QueryOptions, queryOptionsDto } from '../dto/query-options.dto';
import { BadRequestError } from '../utils/http-errors';

export class CategoryController {
  private static categoryService = new CategoryService();
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

  public static async getAllCategories(req: Request, res: Response) {
    const queryOptions = CategoryController.validateQueryDto(req);
    queryOptions.searchType = 'category';
    const catgegories =
      await CategoryController.categoryService.getAllCategories(queryOptions);
    return res.status(StatusCodes.OK).json(catgegories);
  }

  public static async getCategoryById(req: Request, res: Response) {
    const categoryId = parseInt(req.params.category_id, 10);
    if (!categoryId) {
      throw new BadRequestError('Category Id is required');
    }
    const category =
      await CategoryController.categoryService.getCategoryById(categoryId);
    return res.status(StatusCodes.OK).json({ data: category });
  }

  public static async createCategory(req: Request, res: Response) {
    const category = await CategoryController.categoryService.createCategory(
      req.body,
    );
    return res.status(StatusCodes.CREATED).json({ data: category });
  }

  public static async updateCategory(req: Request, res: Response) {
    const categoryId = parseInt(req.params.category_id, 10);
    if (!categoryId) {
      throw new BadRequestError('Category Id is required');
    }
    const category = await CategoryController.categoryService.updateCategory(
      categoryId,
      req.body,
    );
    return res.status(StatusCodes.OK).json({ data: category });
  }

  public static async deleteCategory(req: Request, res: Response) {
    const categoryId = parseInt(req.params.category_id, 10);
    if (!categoryId) {
      throw new BadRequestError('Category Id is required');
    }
    await CategoryController.categoryService.deleteCategory(categoryId);
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  public static async getAllPostsByCategory(req: Request, res: Response) {
    const categoryId = parseInt(req.params.category_id, 10);
    if (!categoryId) {
      throw new BadRequestError('Category Id is required');
    }
    if (!req.query.filters) req.query.filters = {};
    (req.query.filters as any).categoryId = categoryId;

    const posts = await PostController.getAllPosts(req, res);
    return res.status(StatusCodes.OK).json(posts);
  }
}
