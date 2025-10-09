import { Provider } from '@nestjs/common';
import { UserTypeDataMapper } from '../../mappers/user-type.mapper';
import { UserTypeDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-type.mapper';

export const UserTypeMapperProviders: Provider[] = [
  UserTypeDataAccessMapper,
  UserTypeDataMapper,
];
