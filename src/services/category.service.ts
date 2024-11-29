import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { AppDataSource } from '../config/orm.config';
import { ServiceMethod } from './user.service';
import { createCategoryDto, updateCategoryDto } from '../dto/category.dto';
import { BadRequestError, NotFoundError } from '../utils/http-errors';
import { QueryOptions } from '../dto/query-options.dto';
import { Paginator } from '../utils/paginator';

export class CategoryService {
  private categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  private validateCategoryDTO(
    categoryData: Partial<Category>,
    method: ServiceMethod,
  ): Category {
    const dto =
      method === ServiceMethod.create ? createCategoryDto : updateCategoryDto;
    const { error, value } = dto.validate(categoryData, { abortEarly: false });

    if (error) {
      throw new BadRequestError(
        error.details.map((detail) => detail.message).join('; '),
      );
    }
    return value;
  }

  public async getAllCategories(
    queryOptions: QueryOptions,
  ): Promise<{ items: Category[]; total: number }> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    const paginator = new Paginator<Category>(queryOptions);
    return await paginator.paginate(queryBuilder);
  }

  public async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }

  public async createCategory(
    categoryData: Partial<Category>,
  ): Promise<Category> {
    const category = this.validateCategoryDTO(
      categoryData,
      ServiceMethod.create,
    );

    const existingCategory = await this.categoryRepository.findOne({
      where: { title: category.title },
    });
    if (existingCategory) {
      throw new BadRequestError('Category already exists');
    }
    // category.title =
    //   category.title.charAt(0).toUpperCase() +
    //   category.title.slice(1).toLowerCase();
    const newCategory = this.categoryRepository.create(category);
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  public async updateCategory(
    id: number,
    categoryData: Partial<Category>,
  ): Promise<Category> {
    const category = this.validateCategoryDTO(
      categoryData,
      ServiceMethod.update,
    );

    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundError('Category not found');
    }
    const existingCategoryByTitle = await this.categoryRepository.findOne({
      where: { title: category.title },
    });
    if (existingCategoryByTitle && existingCategoryByTitle.id !== id) {
      throw new BadRequestError('Category already exists');
    }
    // category.title =
    //   category.title.charAt(0).toUpperCase() +
    //   category.title.slice(1).toLowerCase();
    await this.categoryRepository.update(id, category);
    return { ...existingCategory, ...category };
  }

  public async deleteCategory(id: number): Promise<void> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundError('Category not found');
    }
    await this.categoryRepository.delete(id);
  }
}
