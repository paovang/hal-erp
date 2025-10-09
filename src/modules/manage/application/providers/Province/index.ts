import { Provider } from '@nestjs/common';
import { ProvinceHandlersProviders } from './command.provider';
import { ProvinceMapperProviders } from './mapper.provider';
import {
  PROVINCE_APPLICATION_SERVICE,
  READ_PROVINCE_REPOSITORY,
} from '../../constants/inject-key.const';
import { ReadProvinceRepository } from '@src/modules/manage/infrastructure/repositories/Province/read.repository';
import { ProvinceService } from '../../services/province.service';

export const ProvinceProvider: Provider[] = [
  ...ProvinceHandlersProviders,
  ...ProvinceMapperProviders,
  {
    provide: PROVINCE_APPLICATION_SERVICE,
    useClass: ProvinceService,
  },
  {
    provide: READ_PROVINCE_REPOSITORY,
    useClass: ReadProvinceRepository,
  },
];
