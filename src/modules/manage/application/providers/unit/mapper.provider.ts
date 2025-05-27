import { Provider } from '@nestjs/common';
import { UnitDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/unit.mapper';
import { UnitDataMapper } from '../../mappers/unit.mapper';

export const UnitMapperProviders: Provider[] = [
  UnitDataAccessMapper,
  UnitDataMapper,
];
