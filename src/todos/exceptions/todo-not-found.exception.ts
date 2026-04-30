import { NotFoundException } from '@nestjs/common';

export class TodoNotFoundException extends NotFoundException {
  constructor(id: number) {
    super({
      message: `Không tìm thấy todo với id: ${id}`,
      errorCode: 'TODO_NOT_FOUND',
      field: 'id',
    });
  }
}
