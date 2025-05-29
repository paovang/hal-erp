import { Module } from '@nestjs/common';
import { ManageModule } from '@src/modules/manage/infrastructure/module/manage.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './common/infrastructure/auth/user.module';
import { UserService } from './common/infrastructure/auth/user.service';
import { CoreAuthModule } from '@core-system/auth';

@Module({
  imports: [
    ManageModule,
    CommonModule,
    UserModule,
    CoreAuthModule.registerAsync({
      provide: 'USER_SERVICE',
      useExisting: UserService,
      imports: [UserModule],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
