import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  findAll(
    // @Query('priority') priority?: 'HIGH' | 'MEDIUM' | 'LOW',
    // @Query('limit') limit?: string,
    // @Query('page') page?: string,
    @Query() queryParamsDto: QueryParamsDto,
  ) {
    return this.todosService.findAll(queryParamsDto);
  }

  @Get(':id')
  getTodoById(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findById(id);
  }

  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
    // @Headers() headers: Record<string, string>,
  ) {
    // const auth = headers.authorization;
    // if (auth) {
    //   return this.todosService.create(createTodoDto);
    // }

    return this.todosService.create(createTodoDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(id, updateTodoDto);
  }

  @HttpCode(204)
  @Delete(':id')
  //ParseUUIDPipe, id: uuid
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.delete(id);
  }
}
