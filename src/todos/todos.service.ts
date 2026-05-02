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
import { UsersService } from 'src/users/users.service';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) // inject repository của TypeORM vào service để có thể sử dụng các phương thức của repository
    private readonly todosRepository: Repository<Todo>,
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}

  // readonly là đã inject vào rồi thì không thể gán lại được nữa

  async findAll(queryParamsDto: QueryParamsDto): Promise<Todo[]> {
    const page = queryParamsDto.page || 1;
    const limit = queryParamsDto.limit || 10;
    const start = (page - 1) * limit;

    const where = queryParamsDto.priority
      ? { priority: queryParamsDto.priority }
      : {};

    const todos = await this.todosRepository.find({
      where: where,
      take: limit,
      skip: start,
    });

    return todos;
  }

  async findById(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id } });

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

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
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

    const existingTodo = await this.todosRepository.findOne({
      where: { title: createTodoDto.title },
    });
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

    return this.todosRepository.save(createTodoDto);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id } });
    if (!todo) {
      throw new TodoNotFoundException(id);
    }

    Object.assign(todo, updateTodoDto); // copy các thuộc tính từ updateTodoDto đè lên todo

    return this.todosRepository.save(todo);
    // save ở hàm update sẽ tự động phân biệt được là đang update hay create dựa vào việc
    //  có id hay không, nếu có id thì sẽ update, nếu không có id thì sẽ tạo mới
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.todosRepository.delete(id);
    if (!deleted.affected) {
      throw new TodoNotFoundException(id);
    }
    //deleted.affected sẽ trả về số lượng bản ghi bị xóa, nếu bằng 0 thì có nghĩa là không tìm thấy todo để xóa nên sẽ ném ra lỗi NotFoundException
  }
}
