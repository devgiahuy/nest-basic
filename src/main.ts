import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // loại bỏ các thuộc tính không được định nghĩa trong DTO
      forbidNonWhitelisted: true,
      // trả về lỗi nếu có thuộc tính không được định nghĩa trong DTO
      transform: true,
      // tự động chuyển đổi kiểu dữ liệu dựa trên các decorator trong DTO
      transformOptions: { enableImplicitConversion: true },
      // cho phép chuyển đổi kiểu dữ liệu một cách ngầm định (ví dụ: "123" thành 123)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
