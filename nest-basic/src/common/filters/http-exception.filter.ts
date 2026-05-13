import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // lấy context của HTTP request
    const res = ctx.getResponse<Response>(); // lấy đối tượng Response để trả về lỗi cho client
    const req = ctx.getRequest<Request>(); // lấy đối tượng Request để lấy thông tin về request (nếu cần)

    if (exception instanceof HttpException) {
      const status = exception.getStatus(); // trả về mã lỗi HTTP (404, 500,...)
      const exceptionResponse = exception.getResponse(); // trả về message lỗi hoặc object lỗi tùy vào cách throw lỗi

      const errorBody =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : (exceptionResponse as { message?: string }); // nếu exceptionResponse là string thì gói nó vào object có key là message, nếu đã là object rồi thì giữ nguyên

      res.status(status).json({
        success: false,
        statusCode: status,
        ...errorBody,
        message: errorBody.message || 'Đã có lỗi xảy ra!',
        // nếu errorBody có message thì dùng message đó, nếu không có thì dùng message mặc định
        // làm điều này để chắc chắn response trả về luôn có message, tránh trường hợp client nhận được lỗi mà không có message gì cả
        path: req.url, // có thể thêm đường dẫn của request vào response để dễ debug
        timestamp: new Date().toISOString(), // thêm timestamp để biết lỗi xảy ra khi nào
      });

      return;
    }

    console.log('Unexpected error:', exception); // log lỗi không phải HttpException để dễ debug

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      errorCode: 'INTERNAL_SERVER_ERROR',
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
