import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodosRepository } from './todos.repository';

@Injectable()
export class TodosService {
  constructor(private todosRepository: TodosRepository) {}

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
      throw new Error(`Todo with id ${id} not found`);
    }
    return todo;
  }

  create(createTodoDto: CreateTodoDto): Todo {
    return this.todosRepository.create(createTodoDto);
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    const updateTodo = this.todosRepository.update(id, updateTodoDto);

    if (!updateTodo) {
      throw new Error(`Todo with id ${id} not found`);
    }

    return updateTodo;
  }

  delete(id: number) {
    const deleted = this.todosRepository.delete(id);
    if (!deleted) {
      throw new Error(`Todo with id ${id} not found`);
    }
  }
}
