import { Provider } from '@nestjs/common';
import { UserSignatureHandlersProviders } from './command.provider';
import { UserSignatureMapperProviders } from './mapper.provider';
import {
  USER_SIGNATURE_APPLICATION_SERVICE,
  WRITE_USER_SIGNATURE_REPOSITORY,
} from '../../constants/inject-key.const';
import { WriteUserSignatureRepository } from '@src/modules/manage/infrastructure/repositories/userSignature/write.repository';

export const UserSignatureProvider: Provider[] = [
  ...UserSignatureHandlersProviders,
  ...UserSignatureMapperProviders,
  //   {
  //     provide: USER_SIGNATURE_APPLICATION_SERVICE,
  //     useClass: UserSignatureService,
  //   },
  {
    provide: WRITE_USER_SIGNATURE_REPOSITORY,
    useClass: WriteUserSignatureRepository,
  },
  //   {
  //     provide: READ_USER_SIGNATURE_REPOSITORY,
  //     useClass: ReadUnitRepository,
  //   },
];
