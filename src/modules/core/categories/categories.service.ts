import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CoreProxy } from 'src/proxy/core.proxy';
import { CoreCategoryResponse } from 'src/proxy/interfaces/core-api.interface';

@Injectable()
export class CategoriesService {
  constructor(private readonly coreProxy: CoreProxy) { }

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CoreCategoryResponse> {
    return this.coreProxy.post<CoreCategoryResponse>(
      '/categories',
      createCategoryDto,
    );
  }

  async findAll(): Promise<CoreCategoryResponse[]> {
    return this.coreProxy.get<CoreCategoryResponse[]>('/categories');
  }

  async findOne(id: string): Promise<CoreCategoryResponse> {
    return this.coreProxy.get<CoreCategoryResponse>(`/categories/${id}`);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CoreCategoryResponse> {
    return this.coreProxy.patch<CoreCategoryResponse>(
      `/categories/${id}`,
      updateCategoryDto,
    );
  }

  async remove(id: string): Promise<void> {
    return this.coreProxy.delete<void>(`/categories/${id}`);
  }
}
