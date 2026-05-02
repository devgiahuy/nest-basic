// decorator
// có thể dùng decorator @Res để điều khiển response trả về,
// nhưng sẽ mất đi tính năng tự động serialize của NestJS,
// nên không khuyến khích sử dụng @Res trong trường hợp này

CHECK VALIDITY:

- Định nghĩa DTO (Data Transfer Object) để validate dữ liệu đầu vào cho các endpoint.
- Thêm các class-validator để validate dữ liệu đầu vào.
- Bật validationPipe trong main.ts để thự thi luật cho tất cả các route.

* PIPE:
  DTO: data transfer object, đối tượng truyền dữ liệu, dùng để validate dữ liệu đầu vào cho các endpoint.

Entity: đối tượng đại diện cho một bảng trong db, có thể gọi là model, schema(mongoose)

- CLI:
  nest g module todos
  nest g co todos --no-spec
  nest g s todos --no-spec
  nest g repository todos --no-spec --flat
  --flat: tạo file trong thư mục hiện tại, không tạo thêm thư mục con.

  nest g class todos/dto/create-todo.dto --no-spec
  nest g resource categories --no-spec

- LB:
  - npm add class-transformer class-validator
    class-transformer: chuyển đổi dữ liệu đầu vào thành instance của class DTO, giúp class-validator có thể validate được.
    class-validator: validate dữ liệu đầu vào dựa trên các decorator được định nghĩa trong class DTO.
  - npm add @nestjs/mapped-types

- whitelist: chỉ cho phép các thuộc tính được định nghĩa trong class DTO được truyền vào, nếu có thuộc tính nào không được định nghĩa sẽ bị loại bỏ, giúp bảo vệ ứng dụng khỏi các dữ liệu không mong muốn.
- forbidNonWhitelisted: nếu có thuộc tính nào không được định nghĩa trong class DTO được truyền vào, sẽ trả về lỗi, giúp bảo vệ ứng dụng khỏi các dữ liệu không mong muốn.
- enableImplicitConversion: tự động chuyển đổi kiểu dữ liệu đầu vào tự động thành kiểu dữ liệu được định nghĩa trong class DTO, giúp giảm thiểu lỗi do kiểu dữ liệu không đúng.

https://docs.nestjs.com/pipes#built-in-pipes

---

Inversion of Control (IoC): là một nguyên tắc trong lập trình mà trong đó, việc tạo và quản lý các đối tượng được chuyển giao cho một framework hoặc container, thay vì do chính ứng dụng tự quản lý.

![alt text](/Image/image.png)

dependency injection (DI): là một kỹ thuật trong lập trình để giảm sự phụ thuộc giữa các thành phần của ứng dụng, giúp tăng tính linh hoạt và dễ bảo trì của mã nguồn.
ví dụ: trong NestJS, chúng ta có thể sử dụng DI để inject một service vào một controller, giúp controller có thể sử dụng các phương thức của service mà không cần phải tự tạo instance của service đó.

![alt text](/Image/image-3.png)

cách hoạt động
![alt text](/Image/image-2.png)

cách sử dụng:
![alt text](/Image/image-4.png)

@Injectable(): là một decorator trong NestJS được sử dụng để đánh dấu một class là một provider, cho phép nó được inject vào các thành phần khác của ứng dụng thông qua cơ chế dependency injection (DI). Khi một class được đánh dấu bằng @Injectable(), NestJS sẽ tự động quản lý vòng đời của instance của class đó và cung cấp nó cho các thành phần khác khi cần thiết.

đăng ký class trong module:
![alt text](/Image/image-5.png)

- providers: là một mảng chứa các provider (các class được đánh dấu bằng @Injectable()) mà module sẽ quản lý và cung cấp cho các thành phần khác của ứng dụng thông qua cơ chế dependency injection (DI). Khi một class được đăng ký trong providers, NestJS sẽ tự động tạo instance của class đó và cung cấp nó cho các thành phần khác khi cần thiết.
- import: là một mảng chứa các module khác mà module hiện tại phụ thuộc vào. Khi một module được import vào một module khác, tất cả các provider và controller của module đó sẽ được cung cấp cho module hiện tại thông qua cơ chế dependency injection (DI). Điều này cho phép các thành phần của module hiện tại có thể sử dụng các provider và controller của module được import mà không cần phải tự tạo instance của chúng.

instance: là một đối tượng được tạo ra từ một class, chứa các thuộc tính và phương thức của class đó. Trong NestJS, khi một class được đánh dấu bằng @Injectable() và được đăng ký trong providers của một module, NestJS sẽ tự động tạo instance của class đó và cung cấp nó cho các thành phần khác của ứng dụng thông qua cơ chế dependency injection (DI). Instance này sẽ được quản lý vòng đời bởi NestJS, có nghĩa là nó sẽ được tạo ra khi cần thiết và bị hủy khi không còn sử dụng nữa.

module architecture: là một cách tổ chức mã nguồn trong NestJS, trong đó các thành phần của ứng dụng được chia thành các module riêng biệt, mỗi module có trách nhiệm quản lý một phần cụ thể của ứng dụng. Mỗi module có thể chứa các controller, service, provider và các thành phần khác liên quan đến chức năng của module đó. Module architecture giúp tăng tính modularity và dễ bảo trì của mã nguồn, cho phép các nhà phát triển dễ dàng quản lý và mở rộng ứng dụng theo từng phần cụ thể.
![alt text](/Image/image-6.png)

- Encapsulation, imports, exports:
  khi muốn sử dụng service của module khác thì phải export service đó trong module chứa service đó, sau đó import nguyên module vào module muốn sử dụng service đó.
  Encapsulation ở cấp module có nghĩa là các thành phần của module chỉ có thể sử dụng các thành phần được export bởi module đó, không thể truy cập trực tiếp vào các thành phần khác của module. Điều này giúp bảo vệ tính toàn vẹn của module và giảm sự phụ thuộc giữa các module, giúp tăng tính modularity và dễ bảo trì của mã nguồn.
  VÍ DỤ: khi 1 module A có nhiều service, nhưng chỉ muốn export 1 service để các module khác sử dụng, thì chỉ cần export service đó trong module A, các service còn lại sẽ không được export và không thể truy cập trực tiếp từ các module khác.

# ERROR:

- BadRequestException: bad request status code 400 client gửi dữ liệu không hợp lệ
- UnauthorizedException: unauthorized status code 401 lỗi do client không có quyền truy cập
- ForbiddenException: forbidden status code 403 lỗi do client đã đăng nhập nhưng không có quyền truy cập vào tài nguyên
- NotFoundException: not found status code 404 lỗi do tài nguyên không tồn tại
- ConflictException: conflict status code 409 lỗi do xung đột dữ liệu, ví dụ khi tạo một tài khoản (username/email) đã tồn tại
- InternalServerErrorException: internal server error status code 500 lỗi do server

======================================

# ORM: Object-ralational mapping/ Anh xạ quan hệ đối tượng

ORM là một lớp trung gian giữa ứng dụng và cơ sở dữ liệu, giúp chuyển đổi dữ liệu giữa các đối tượng trong ứng dụng và các bảng trong cơ sở dữ liệu. ORM cung cấp một cách tiếp cận hướng đối tượng để làm việc với cơ sở dữ liệu, giúp giảm sự phức tạp của việc viết SQL thủ công và tăng tính linh hoạt của mã nguồn.

# Lợi ích:

- code ngắn gọn hơn, dễ đọc hơn
- type safety (an toàn về kiểu): giúp phát hiện lỗi về kiểu dữ liệu sớm hơn trong quá trình phát triển
- dễ bảo trì khi schema thay đổi. khi thay đổi schema, chỉ cần thay đổi entity, không cần phải thay đổi toàn bộ code liên quan đến database
- quản lý hệ giữa các bảng dễ hàng hơn ví dụ: one-to-many, many-to-many, one-to-one chỉ cần định nghĩa trong entity, không cần phải viết SQL thủ công để quản lý mối quan hệ giữa các bảng ORM sẽ tự lo phần join tự lồng object đây là phần mạnh nhất của ORM
- bảo mật hơn khi sử dụng ORM, chúng ta không cần phải viết SQL thủ công, giúp giảm nguy cơ bị tấn công SQL injection
  ví dụ OR 1=1 để bypass authentication, nhưng khi sử dụng ORM, chúng ta sẽ không viết SQL thủ công, giúp giảm nguy cơ bị tấn công SQL injection
- repository pattern: ORM cung cấp sẵn các phương thức find, create, update, delete,... chỉ cần inject vào và dùng
- không bị khóa chặt vào 1 database cụ thể

# Các ORM phổ biến:

- TypeORM: là một ORM phổ biến trong cộng đồng Node.js, hỗ trợ nhiều loại
- Prisma: là một ORM mới nổi, được đánh giá cao về hiệu suất và tính năng, hỗ trợ nhiều loại database, có một công cụ CLI mạnh mẽ giúp quản lý schema và migration dễ dàng hơn.
- Drizzle ORM: là một ORM mới nổi, được đánh giá cao về hiệu suất và tính năng, hỗ trợ nhiều loại database, có một công cụ CLI mạnh mẽ giúp quản lý schema và migration dễ dàng hơn.

# TypeORM sẽ phù hợp với nestjs vì có nhiều điểm tương đồng về patten.

# ORM sẽ giúp code backend của bạn trở nên sạch sẽ hơn, dễ đọc hơn, dễ bảo trì hơn, giúp bạn tập trung vào logic nghiệp vụ thay vì phải lo lắng về việc viết SQL thủ công và quản lý kết nối đến database. ORM cũng giúp tăng tính bảo mật cho ứng dụng của bạn bằng cách giảm nguy cơ bị tấn công SQL injection.

- - ![alt text](/Image/image-7.png)

# TypeORM CLI:

npm add @nestjs/typeorm typeorm pg @nestjs/config
=> lệnh để cài đặt TypeORM, driver cho PostgreSQL và module config của NestJS để quản lý biến môi trường.
===============================

# Docker

CLI:

- docker compose up -d: chạy docker compose ở chế độ detached, tức là chạy ở background, không hiển thị log trên terminal
- docker ps: hiển thị danh sách các container đang chạy
