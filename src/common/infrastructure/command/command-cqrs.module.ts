import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
  imports: [CqrsModule], // ทำให้เป็น Global
  exports: [CqrsModule], // ให้ module อื่นใช้ได้
})
export class CqrsGlobalModule {}
