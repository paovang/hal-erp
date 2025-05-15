import { DepartmentService } from '@src/modules/manage/application/services/department.service';
import {
  DEPARTMENT_APPLICATION_SERVICE,
  READ_DEPARTMENT_REPOSITORY,
} from '@src/modules/manage/application/constants/inject-key.const';
import { Provider } from '@nestjs/common';
import { ReadDepartmentRepository } from '@src/modules/manage/infrastructure/repositories/department/read.repository';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';

export const DepartmentProvider: Provider[] = [
  {
    provide: DEPARTMENT_APPLICATION_SERVICE,
    useClass: DepartmentService,
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
