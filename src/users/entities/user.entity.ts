import { Todo } from 'src/todos/entities/todo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // Thiết lập quan hệ một-nhiều với Todo để xem 1 user có todo nào
  @OneToMany(() => Todo, (todo) => todo.user)
  todos?: Todo[];
}
