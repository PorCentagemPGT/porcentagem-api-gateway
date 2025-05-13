import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [UsersModule, CategoriesModule],
  exports: [UsersModule, CategoriesModule],
})
export class CoreModule {}
