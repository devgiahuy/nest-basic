import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from '@nestjs/config'; // đọc biến môi trường
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todos/entities/todo.entity';
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';

@Module({
  imports: [
    TodosModule,
    UsersModule,
    CategoriesModule,
    ConfigModule.forRoot({ isGlobal: true }), // cấu hình biến môi trường toàn cục
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Todo, User, Category], // đăng ký entity với TypeORM
      synchronize: process.env.NODE_ENV !== 'production', // tự động đồng bộ với database với entities trong code
      logging: true, // bật logging để xem các câu query được thực thi
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
