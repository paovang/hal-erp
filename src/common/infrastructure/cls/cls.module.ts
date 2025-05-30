import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { UserContextService } from './cls.service';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: () => {
          // ສ້າງ unique ID ສຳຫລັບເເຕ່ລະ request
          return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        },
      },
    }),
  ],
  providers: [UserContextService],
  exports: [UserContextService],
})
export class ClsAuthModule {}
