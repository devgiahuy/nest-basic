import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private userUsers: User[] = [
    { id: 1, name: 'An' },
    { id: 2, name: 'Binh' },
  ];

  findById(id: number): User {
    const user = this.userUsers.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(id);
    }

    return user;
  }
}
