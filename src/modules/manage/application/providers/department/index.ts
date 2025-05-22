import { DepartmentService } from '@src/modules/manage/application/services/department.service';
import {
  DEPARTMENT_APPLICATION_SERVICE,
  READ_DEPARTMENT_REPOSITORY,
  WRITE_DEPARTMENT_REPOSITORY,
} from '@src/modules/manage/application/constants/inject-key.const';
import { Provider } from '@nestjs/common';
import { ReadDepartmentRepository } from '@src/modules/manage/infrastructure/repositories/department/read.repository';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
  TRANSFORM_RESULT_SERVICE,
} from '@src/common/constants/inject-key.const';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import { WriteDepartmentRepository } from '@src/modules/manage/infrastructure/repositories/department/write.repository';
import { DepartmentMapperProviders } from '@src/modules/manage/application/providers/department/mapper.provider';
import { DepartmentHandlersProviders } from '@src/modules/manage/application/providers/department/command.provider';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';

export const DepartmentProvider: Provider[] = [
  ...DepartmentHandlersProviders,
  ...DepartmentMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: DEPARTMENT_APPLICATION_SERVICE,
    useClass: DepartmentService,
  },
  {
    provide: WRITE_DEPARTMENT_REPOSITORY,
    useClass: WriteDepartmentRepository,
  },
  {
    provide: READ_DEPARTMENT_REPOSITORY,
    useClass: ReadDepartmentRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
