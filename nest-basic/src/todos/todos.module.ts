import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports: [CategoriesModule, UsersModule, TypeOrmModule.forFeature([Todo])],
})
export class TodosModule {}

// đăng ký middleware cho module này, middleware sẽ được áp dụng cho tất cả các route trong module này
// export class TodosModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(RequestMiddleware).forRoutes('todos'); // áp dụng middleware cho tất cả các route trong module này
//   }
// }
