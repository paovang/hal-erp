import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import {
  DEPARTMENT_USER_APPLICATION_SERVICE,
  WRITE_DEPARTMENT_USER_REPOSITORY,
} from '../../constants/inject-key.const';
import { WriteDepartmentUserRepository } from '@src/modules/manage/infrastructure/repositories/departmentUser/write.repository';
import { Provider } from '@nestjs/common';
import { DepartmentUserService } from '../../services/department-user.service';
import { DepartmentUserHandlersProviders } from './command.provider';
import { DepartmentUserMapperProviders } from './mapper.provider';

export const DepartmentUserProvider: Provider[] = [
  ...DepartmentUserHandlersProviders,
  ...DepartmentUserMapperProviders,
  {
    provide: DEPARTMENT_USER_APPLICATION_SERVICE,
    useClass: DepartmentUserService,
  },
  {
    provide: WRITE_DEPARTMENT_USER_REPOSITORY,
    useClass: WriteDepartmentUserRepository,
  },
  //   {
  //     provide: READ_UNIT_REPOSITORY,
  //     useClass: ReadUnitRepository,
  //   },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
