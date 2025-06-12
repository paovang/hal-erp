import { Provider } from '@nestjs/common';
import { UserSignatureDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-signature.mapper';
import { UserSignatureDataMapper } from '../../mappers/user-signature.mapper';

export const UserSignatureMapperProviders: Provider[] = [
  UserSignatureDataAccessMapper,
  UserSignatureDataMapper,
];
