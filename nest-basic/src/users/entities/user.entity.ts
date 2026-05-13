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

  @Column({ type: 'timestamp', nullable: true })
  lastActivity?: Date;

  @Column({ nullable: true })
  // khi thêm cột mới vào thì nên để nullable: true để tránh lỗi khi chạy ứng dụng với database đã có sẵn dữ liệu, sau đó có thể viết migration để cập nhật dữ liệu cho cột này rồi mới set nullable: false nếu muốn bắt buộc phải có email
  email!: string;
}
