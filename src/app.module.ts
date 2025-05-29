import { Module } from '@nestjs/common';
import { ManageModule } from '@src/modules/manage/infrastructure/module/manage.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule, ManageModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
