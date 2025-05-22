import { Provider } from '@nestjs/common';
import {
  READ_UNIT_REPOSITORY,
  UNIT_APPLICATION_SERVICE,
  WRITE_UNIT_REPOSITORY,
} from '../../constants/inject-key.const';
import { WriteUnitRepository } from '@src/modules/manage/infrastructure/repositories/unit/write.repository';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import { UnitService } from '../../services/unit.service';
import { UnitMapperProviders } from './mapper.provider';
import { UnitHandlersProviders } from './command.provider';
import { ReadUnitRepository } from '@src/modules/manage/infrastructure/repositories/unit/read.repository';

export const UnitProvider: Provider[] = [
  ...UnitHandlersProviders,
  ...UnitMapperProviders,
  {
    provide: UNIT_APPLICATION_SERVICE,
    useClass: UnitService,
  },
  {
    provide: WRITE_UNIT_REPOSITORY,
    useClass: WriteUnitRepository,
  },
  {
    provide: READ_UNIT_REPOSITORY,
    useClass: ReadUnitRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
