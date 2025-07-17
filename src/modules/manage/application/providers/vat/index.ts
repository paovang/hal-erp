import { Provider } from '@nestjs/common';
import {
  READ_VAT_REPOSITORY,
  VAT_APPLICATION_SERVICE,
  WRITE_VAT_REPOSITORY,
} from '../../constants/inject-key.const';
import { VatMapperProviders } from './mapper.provider';
import { VatHandlersProviders } from './command.provider';
import { VatService } from '../../services/vat.service';
import { WriteVatRepository } from '@src/modules/manage/infrastructure/repositories/vat/write.repository';
import { ReadVatRepository } from '@src/modules/manage/infrastructure/repositories/vat/read.repository';

export const VatProvider: Provider[] = [
  ...VatHandlersProviders,
  ...VatMapperProviders,
  {
    provide: VAT_APPLICATION_SERVICE,
    useClass: VatService,
  },
  {
    provide: WRITE_VAT_REPOSITORY,
    useClass: WriteVatRepository,
  },
  {
    provide: READ_VAT_REPOSITORY,
    useClass: ReadVatRepository,
  },
];
