import { Module } from '@nestjs/common';
import { PAGINATION_SERVICE } from '@common/constants/inject-key.const';
import { PaginationService } from '@common/infrastructure/pagination/pagination.service';

@Module({
  providers: [
    {
      provide: PAGINATION_SERVICE,
      useClass: PaginationService,
    },
  ],
  exports: [PAGINATION_SERVICE],
})
export class PaginationModule {}
