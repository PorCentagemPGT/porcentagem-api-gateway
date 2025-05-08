import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  private readonly coreApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.coreApiUrl = this.configService.getOrThrow<string>('CORE_API_URL');
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    this.logger.log(`Creating category: ${createCategoryDto.name}`);
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<Category>(
          `${this.coreApiUrl}/categories`,
          createCategoryDto,
        ),
      );

      this.logger.log(`Category created successfully: ${data.id}`);
      return data;
    } catch (error) {
      this.logger.error('Error creating category', error);

      if (error instanceof AxiosError) {
        throw error.response?.data ?? error;
      }

      throw error;
    }
  }

  async findAll(): Promise<Category[]> {
    this.logger.log('Retrieving all categories');
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Category[]>(`${this.coreApiUrl}/categories`),
      );

      this.logger.log(`All categories retrieved successfully`);
      return data;
    } catch (error) {
      this.logger.error('Error retrieving all categories', error);

      if (error instanceof AxiosError) {
        throw error.response?.data ?? error;
      }

      throw error;
    }
  }

  async findOne(id: string): Promise<Category> {
    this.logger.log(`Retrieving category - id: ${id}`);
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Category>(`${this.coreApiUrl}/categories/${id}`),
      );

      this.logger.log(`Category retrieved successfully - id: ${id}`);
      return data;
    } catch (error) {
      this.logger.error(`Category not found - id: ${id}`, error);

      if (error instanceof AxiosError) {
        throw error.response?.data ?? error;
      }

      throw error;
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    this.logger.log(`Updating category - id: ${id}`);
    try {
      await this.findOne(id); // Garante que a categoria existe

      const { data } = await firstValueFrom(
        this.httpService.patch<Category>(
          `${this.coreApiUrl}/categories/${id}`,
          updateCategoryDto,
        ),
      );

      this.logger.log(`Category updated successfully - id: ${id}`);
      return data;
    } catch (error) {
      this.logger.error(`Error updating category - id: ${id}`, error);

      if (error instanceof AxiosError) {
        throw error.response?.data ?? error;
      }

      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing category - id: ${id}`);
    try {
      await this.findOne(id); // Garante que a categoria existe

      await firstValueFrom(
        this.httpService.delete<Category>(
          `${this.coreApiUrl}/categories/${id}`,
        ),
      );
      this.logger.log(`Category removed successfully - id: ${id}`);
    } catch (error) {
      this.logger.error(`Error removing category - id: ${id}`, error);

      if (error instanceof AxiosError) {
        throw error.response?.data ?? error;
      }

      throw error;
    }
  }
}
