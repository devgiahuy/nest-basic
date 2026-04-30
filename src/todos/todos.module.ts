import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TodosRepository } from './todos.repository';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TodosController],
  providers: [TodosService, TodosRepository],
  imports: [CategoriesModule, UsersModule],
})
export class TodosModule {}
