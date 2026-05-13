import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { TodoPriority } from 'src/todos/enums/todo-priority.enum';

export class QueryParamsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(TodoPriority, {
    message: `priority must be one of the following values: ${Object.values(
      TodoPriority,
    ).join(', ')}`,
  })
  priority?: TodoPriority;
}

// @ValidateNested()
// @Type(()=> QueryParamsDto)
