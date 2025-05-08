import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity'; // Ajuste conforme sua entidade

@ApiTags('Categories')
@Controller('/core/categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova categoria' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    type: Category,
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    this.logger.log(
      `Create category request received - name: ${createCategoryDto.name}`,
    );
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias',
    type: [Category],
  })
  async findAll(): Promise<Category[]> {
    this.logger.log('List categories request received');
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma categoria pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada',
    type: Category,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    this.logger.log(`Find category request received - id: ${id}`);
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma categoria pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada',
    type: Category,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    this.logger.log(`Update category request received - id: ${id}`);
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma categoria pelo ID' })
  @ApiResponse({
    status: 204,
    description: 'Categoria removida com sucesso',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.log(`Delete category request received - id: ${id}`);
    await this.categoriesService.remove(id);
  }
}
