import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmRepositoryModule } from '../database/type-orm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmRepositoryModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
