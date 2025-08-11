import { LOCALIZATION_SERVICE } from '@src/common/constants/inject-key.const';
import { Provider } from '@nestjs/common';
import { UserTypeHandlersProviders } from './command.provider';
import { UserTypeMapperProviders } from './mapper.provider';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { WriteUserTypeRepository } from '@src/modules/manage/infrastructure/repositories/department-user-type/write.repository';
import { USER_TYPE_APPLICATION_SERVICE } from '../../constants/inject-key.const';

export const UserTypeProvider: Provider[] = [
  ...UserTypeHandlersProviders,
  ...UserTypeMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: USER_TYPE_APPLICATION_SERVICE,
    useClass: WriteUserTypeRepository,
  },
  // {
  //   provide: TRANSFORM_RESULT_SERVICE,
  //   useClass: TransformResultService,
  // },
];
