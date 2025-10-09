import { Provider } from '@nestjs/common';
import {
  DEPARTMENT_APPROVER_APPLICATION_SERVICE,
  READ_DEPARTMENT_APPROVER_REPOSITORY,
  WRITE_DEPARTMENT_APPROVER_REPOSITORY,
} from '../../constants/inject-key.const';
// import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
// import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import { WriteDepartmentApproverRepository } from '@src/modules/manage/infrastructure/repositories/departmentApprover/write.repository';
import { DepartmentApproverService } from '../../services/department-approver.service';
import { DepartmentApproverHandlersProviders } from './command.provider';
import { DepartmentApproverMapperProviders } from './mapper.provider';
import { ReadDepartmentApproverRepository } from '@src/modules/manage/infrastructure/repositories/departmentApprover/read.repository';

export const DepartmentApproverProvider: Provider[] = [
  ...DepartmentApproverHandlersProviders,
  ...DepartmentApproverMapperProviders,
  {
    provide: DEPARTMENT_APPROVER_APPLICATION_SERVICE,
    useClass: DepartmentApproverService,
  },
  {
    provide: WRITE_DEPARTMENT_APPROVER_REPOSITORY,
    useClass: WriteDepartmentApproverRepository,
  },
  {
    provide: READ_DEPARTMENT_APPROVER_REPOSITORY,
    useClass: ReadDepartmentApproverRepository,
  },
  // {
  //   provide: TRANSFORM_RESULT_SERVICE,
  //   useClass: TransformResultService,
  // },
];
