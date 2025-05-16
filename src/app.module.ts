import { Module } from '@nestjs/common';
import { DepartmentModule } from '@src/modules/manage/infrastructure/module/department.module';
import { CommonModule } from './common/common.module';
import { DocumentTypeModule } from './modules/manage/infrastructure/module/document-type.module';

@Module({
  imports: [DepartmentModule, CommonModule, DocumentTypeModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
