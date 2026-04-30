import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}

// dùng partial type để tạo ra một DTO mới có tất cả các trường của CreateTodoDto nhưng tất cả đều là optional,
//  giúp tránh việc phải định nghĩa lại tất cả các trường trong UpdateTodoDto.
