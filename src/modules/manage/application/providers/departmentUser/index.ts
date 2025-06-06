import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import {
  DEPARTMENT_USER_APPLICATION_SERVICE,
  READ_DEPARTMENT_USER_REPOSITORY,
  WRITE_DEPARTMENT_USER_REPOSITORY,
} from '../../constants/inject-key.const';
import { WriteDepartmentUserRepository } from '@src/modules/manage/infrastructure/repositories/departmentUser/write.repository';
import { Provider } from '@nestjs/common';
import { DepartmentUserService } from '../../services/department-user.service';
import { DepartmentUserHandlersProviders } from './command.provider';
import { DepartmentUserMapperProviders } from './mapper.provider';
import { ReadDepartmentUserRepository } from '@src/modules/manage/infrastructure/repositories/departmentUser/read.repository';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';

export const DepartmentUserProvider: Provider[] = [
  ...DepartmentUserHandlersProviders,
  ...DepartmentUserMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: DEPARTMENT_USER_APPLICATION_SERVICE,
    useClass: DepartmentUserService,
  },
  {
    provide: WRITE_DEPARTMENT_USER_REPOSITORY,
    useClass: WriteDepartmentUserRepository,
  },
  {
    provide: READ_DEPARTMENT_USER_REPOSITORY,
    useClass: ReadDepartmentUserRepository,
  },
  // {
  //   provide: TRANSFORM_RESULT_SERVICE,
  //   useClass: TransformResultService,
  // },
];
