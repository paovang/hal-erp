import { Module } from '@nestjs/common';
import { DepartmentModule } from '@src/modules/manage/infrastructure/module/department.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [DepartmentModule, CommonModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
