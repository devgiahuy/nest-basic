import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TodoPriority } from '../enums/todo-priority.enum';
import { TodoStatus } from '../enums/todo-status.enum';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: TodoStatus, default: TodoStatus.OPEN })
  status!: TodoStatus;

  @Column({ type: 'enum', enum: TodoPriority, nullable: true })
  priority?: TodoPriority;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: 'userId' }) //tạo khóa ngoại liên kết với bảng User
  //referencedColumnName: 'id' là mặc định, nên có thể bỏ qua nếu trường khóa chính của bảng User là id
  user!: User;

  @Column({ nullable: true })
  categoryId?: number;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
