import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TodosService } from '../todos.service';

@Injectable()
export class TodoOwnershipGuard implements CanActivate {
  constructor(
    private readonly todoService: TodosService, // Giả sử có service để truy cập dữ liệu todo
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    // Add your logic here to check todo ownership
    const todoId = Number(request.params.id);
    const userId = request.userId;

    const todo = await this.todoService.findById(todoId); // Giả sử có method để tìm todo theo id

    if (todo.userId !== userId) {
      return false;
      //   throw new ForbiddenException('Access denied');
    }

    request.todo = todo; // Gắn thông tin todo vào request để có thể sử dụng trong controller nếu cần

    return true;
  }
}
