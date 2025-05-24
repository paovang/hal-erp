import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import {
  POSITION_APPLICATION_SERVICE,
  READ_POSITION_REPOSITORY,
  WRITE_POSITION_REPOSITORY,
} from '../../constants/inject-key.const';
import { PositionService } from '../../services/position.service';
import { Provider } from '@nestjs/common';
import { WritePositionRepository } from '@src/modules/manage/infrastructure/repositories/position/write.repository';
import { PositionMapperProviders } from './mapper.provider';
import { PositionHandlersProviders } from './command.provider';
import { ReadPositionRepository } from '@src/modules/manage/infrastructure/repositories/position/read.repository';

export const PositionProvider: Provider[] = [
  ...PositionHandlersProviders,
  ...PositionMapperProviders,
  {
    provide: POSITION_APPLICATION_SERVICE,
    useClass: PositionService,
  },
  {
    provide: WRITE_POSITION_REPOSITORY,
    useClass: WritePositionRepository,
  },
  {
    provide: READ_POSITION_REPOSITORY,
    useClass: ReadPositionRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
