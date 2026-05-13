import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Implementation for authentication logic
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('Token not found');
      // tại sao throw exception thay vì return false ??
      // vì nếu return false thì NestJS sẽ trả về lỗi mặc định throw ForbiddenException() status 403 ,
      // nhưng trong trường hợp này chúng ta muốn trả về lỗi 401 Unauthorized
      //  để cho biết rằng người dùng chưa được xác thực
      // 403 là đã đăng nhập nhưng ko có quyền truy cập
    }

    //validate token & get userId from token
    request.userId = 1; // Giả sử userId được lấy từ token sau khi xác thực thành công

    return true;
  }
}

// canActivate() là method có thể hiểu là cho phép truy cập
