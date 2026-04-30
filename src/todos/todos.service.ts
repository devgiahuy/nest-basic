import { CategoriesService } from './../categories/categories.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodosRepository } from './todos.repository';
import { UsersService } from 'src/users/users.service';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';

@Injectable()
export class TodosService {
  constructor(
    private readonly todosRepository: TodosRepository,
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}

  findAll(queryParamsDto: QueryParamsDto): Todo[] {
    let todos = this.todosRepository.findAll();

    if (queryParamsDto.priority) {
      todos = todos.filter((todo) => todo.priority === queryParamsDto.priority);
    }

    const page = queryParamsDto.page || 1;
    const limit = queryParamsDto.limit || 10;

    const start = (page - 1) * limit;

    return todos.slice(start, start + limit);
  }

  findById(id: number) {
    const todo = this.todosRepository.findById(id);

    if (!todo) {
      // throw new HttpException(
      //   `Không tìm thấy todo với id: ${id}`,
      //   HttpStatus.NOT_FOUND,
      // );
      // throw new NotFoundException(`Không tìm thấy todo với id: ${id}`);
      throw new TodoNotFoundException(id);
    }
    return todo;
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const user = this.usersService.findById(createTodoDto.userId);
    if (!user) {
      throw new NotFoundException({
        message: `Không tìm thấy user với id: ${createTodoDto.userId}`,
        errorCode: 'USER_NOT_FOUND',
        field: 'userId',
        statusCode: 404,
      });
    }

    if (createTodoDto.categoryId) {
      const category = this.categoriesService.findOne(createTodoDto.categoryId);
      if (!category) {
        throw new NotFoundException({
          message: `Không tìm thấy danh mục với id: ${createTodoDto.categoryId}`,
          errorCode: 'CATEGORY_NOT_FOUND',
          field: 'categoryId',
          statusCode: 404,
        });
      }
    }

    const existingTodo = this.todosRepository.findByTitle(createTodoDto.title);
    if (existingTodo) {
      // throw new BadRequestException(
      //   `Đã tồn tại todo với tiêu đề: ${createTodoDto.title}`,
      // );
      throw new BadRequestException({
        message: `Đã tồn tại todo với tiêu đề: ${createTodoDto.title}`,
        errorCode: 'TODO_TITLE_DUPLICATED',
        field: 'title',
        statusCode: 400,
      });
      // khi truyền 1 obj nó sẽ thay thế hoàn toàn message của BadRequestException
    }

    return this.todosRepository.create(createTodoDto);
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    const updateTodo = this.todosRepository.update(id, updateTodoDto);

    if (!updateTodo) {
      throw new TodoNotFoundException(id);
    }

    return updateTodo;
  }

  delete(id: number) {
    const deleted = this.todosRepository.delete(id);
    if (!deleted) {
      throw new TodoNotFoundException(id);
    }
  }
}
