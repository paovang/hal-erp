import { Module } from '@nestjs/common';
import { ManageModule } from '@src/modules/manage/infrastructure/module/manage.module';
import { CommonModule } from './common/common.module';
import { ReportModule } from './modules/reports/infrastructure/module/report.module';

@Module({
  imports: [CommonModule, ManageModule, ReportModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
