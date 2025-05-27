import { Provider } from '@nestjs/common';
import { PositionDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/position.mapper';
import { PositionDataMapper } from '../../mappers/position.mapper';

export const PositionMapperProviders: Provider[] = [
  PositionDataAccessMapper,
  PositionDataMapper,
];
