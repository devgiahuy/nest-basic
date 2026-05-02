import * as fs from 'fs';
import * as path from 'path';
import { Todo } from './entities/todo.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Injectable } from '@nestjs/common';

const TODOS_FILE = path.join(__dirname, 'todos.json');

@Injectable()
export class TodosRepository {
  private readFromFile(): Todo[] {
    const data = fs.readFileSync(TODOS_FILE, 'utf-8');
    return JSON.parse(data) as Todo[];
  }

  private writeToFile(todos: Todo[]): void {
    fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2), 'utf-8');
  }

  private getNextId(todo: Todo[]): number {
    if (todo.length === 0) return 1;
    // return todos[todos.length - 1].id + 1;
    return Math.max(...todo.map((t) => t.id)) + 1;
  }

  findAll(): Todo[] {
    return this.readFromFile();
  }

  findById(id: number) {
    const todos = this.readFromFile();
    return todos.find((todo) => todo.id === id);
  }

  findByTitle(title: string): Todo | undefined {
    const todos = this.readFromFile();
    return todos.find((todo) =>
      todo.title.toLowerCase().includes(title.toLowerCase()),
    );
  }

  // create(CreateTodoDto: CreateTodoDto): Todo {
  //   const todos = this.readFromFile();
  //   const newTodo: Todo = {
  //     id: this.getNextId(todos),
  //     title: CreateTodoDto.title,
  //     description: CreateTodoDto.description || '',
  //     status: CreateTodoDto.status || TodoStatus.OPEN,
  //     priority: CreateTodoDto.priority || TodoPriority.MEDIUM,
  //     categoryId: CreateTodoDto.categoryId,
  //     userId: CreateTodoDto.userId,
  //     createAt: new Date(),
  //     updateAt: new Date(),
  //   };

  //   todos.push(newTodo);
  //   this.writeToFile(todos);
  //   return newTodo;
  // }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo | undefined {
    const todos = this.readFromFile();
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      return undefined;
    }

    todos[index] = {
      ...todos[index],
      ...updateTodoDto,
      updateAt: new Date(),
    };

    this.writeToFile(todos);
    return todos[index];
  }

  delete(id: number): boolean {
    const todos = this.readFromFile();
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      return false;
    }
    todos.splice(index, 1);
    this.writeToFile(todos);
    return true;
  }
}
