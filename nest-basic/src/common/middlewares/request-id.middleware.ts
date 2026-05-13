import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = randomUUID(); // tạo một mã định danh duy nhất cho mỗi request
    req['requestId'] = requestId; // gán mã định danh vào đối tượng request để có thể truy cập ở các phần khác của ứng dụng
    res.setHeader('X-Request-Id', requestId); // gán mã định danh vào header của response để có thể truy cập ở client hoặc các phần khác của ứng dụng

    console.log(`Request ID: ${requestId} - ${req.method} ${req.originalUrl}`); // log thông tin request cùng với mã định danh để dễ dàng theo dõi và debug

    next(); // gọi next() để tiếp tục xử lý request
  }
}
