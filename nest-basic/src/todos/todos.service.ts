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
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) // inject repository của TypeORM vào service để có thể sử dụng các phương thức của repository
    private readonly todosRepository: Repository<Todo>,
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource, // sử dụng transaction của TypeORM
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
      relations: ['user', 'category'], //tự động join với bảng user và category để lấy thông tin của user và category liên quan đến todo
    });

    return todos;
  }

  async findById(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });

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
    const user = await this.usersService.findById(createTodoDto.userId);
    if (!user) {
      throw new NotFoundException({
        message: `Không tìm thấy user với id: ${createTodoDto.userId}`,
        errorCode: 'USER_NOT_FOUND',
        field: 'userId',
        statusCode: 404,
      });
    }

    if (createTodoDto.categoryId) {
      const category = await this.categoriesService.findById(
        createTodoDto.categoryId,
      );
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

    return this.dataSource.transaction(async (manager) => {
      const saveTodo = await manager.save(Todo, createTodoDto); // tạo mới todo

      await manager.update(
        User,
        { id: createTodoDto.userId },
        { lastActivity: new Date() },
      ); // cập nhật lastActivity của user khi tạo todo mới
      // lưu ý: ở đây phải dùng manager để update user trong transaction, không được dùng usersRepository vì nó sẽ không nằm trong transaction
      // mọi thứ trong transaction đều phải dùng manager để đảm bảo tính toàn vẹn của dữ liệu, nếu dùng repository sẽ không được quản lý bởi transaction
      // khi dùng manager thì tham số đầu tiên là entity, tham số thứ 2 là điều kiện để tìm bản ghi cần update, tham số thứ 3 là dữ liệu cần update
      return saveTodo;
    });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    if (updateTodoDto.categoryId) {
      const categpory = await this.categoriesService.findById(
        updateTodoDto.categoryId,
      );

      if (!categpory) {
        throw new NotFoundException({
          message: `Không tìm thấy danh mục với id: ${updateTodoDto.categoryId}`,
        });
      }
    }

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
