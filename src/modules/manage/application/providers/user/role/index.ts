import { Provider } from "@nestjs/common";
import { READ_ROLE_REPOSITORY, ROLE_APPLICATION_SERVICE } from "../../../constants/inject-key.const";
import { TRANSFORM_RESULT_SERVICE } from "@src/common/constants/inject-key.const";
import { RoleService } from "../../../services/role.service";
import { ReadRoleRepository } from "@src/modules/manage/infrastructure/repositories/user/role/read.repository";
import { TransformResultService } from "@src/common/utils/services/transform-result.service";
import { RoleMapperProviders } from "./mapper.provider";
import { RoleHandlersProviders } from "./command.provider";

export const RoleProvider: Provider[] = [
    ...RoleHandlersProviders,
    ...RoleMapperProviders,
  {
    provide: ROLE_APPLICATION_SERVICE,
    useClass: RoleService,
  },
//   {
//     provide: WRITE_USER_REPOSITORY,
//     useClass: WriteUserRepository,
//   },
  {
    provide: READ_ROLE_REPOSITORY,
    useClass: ReadRoleRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];