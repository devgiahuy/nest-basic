import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TodoPriority } from '../enums/todo-priority.enum';
import { TodoStatus } from '../enums/todo-status.enum';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Index(['userId'])
@Index(['categoryId'])
@Index(['userId', 'title']) // composite index (index tổ hợp) chỉ hoạt động khi truy vấn có cả userId và title
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

  @ManyToOne(() => User, (user) => user.todos, { onDelete: 'CASCADE' }) //eager: true để tự động load thông tin user khi load todo
  @JoinColumn({ name: 'userId' }) //tạo khóa ngoại liên kết với bảng User
  //referencedColumnName: 'id' là mặc định, nên có thể bỏ qua nếu trường khóa chính của bảng User là id
  user!: User;

  @Column({ nullable: true })
  @Index('idx_todo_category_hight', { where: `"priority" = 'HIGH'` }) //tạo index riêng cho categoryId để tối ưu truy vấn lọc theo category
  categoryId?: number;

  // sử dụng eager: true là optional vì không phải todo nào cũng có category, nếu có category thì sẽ liên kết với bảng Category thông qua khóa ngoại categoryId
  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' }) //nếu category bị xóa thì set categoryId của todo thành null
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;
}
