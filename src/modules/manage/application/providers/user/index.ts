import { Provider } from "@nestjs/common";
import { READ_USER_REPOSITORY, USER_APPLICATION_SERVICE, WRITE_USER_REPOSITORY } from "../../constants/inject-key.const";
import { TRANSFORM_RESULT_SERVICE } from "@src/common/constants/inject-key.const";
import { UserService } from "../../services/user.service";
import { UserHandlersProviders } from "./command.provider";
import { UserMapperProviders } from "./mapper.provider";
import { WriteUserRepository } from "@src/modules/manage/infrastructure/repositories/user/write.repository";
import { ReadUserRepository } from "@src/modules/manage/infrastructure/repositories/user/read.repository";
import { TransformResultService } from "@src/common/utils/services/transform-result.service";

export const UserProvider: Provider[] = [
    ...UserHandlersProviders,
    ...UserMapperProviders,
  {
    provide: USER_APPLICATION_SERVICE,
    useClass: UserService,
  },
  {
    provide: WRITE_USER_REPOSITORY,
    useClass: WriteUserRepository,
  },
  {
    provide: READ_USER_REPOSITORY,
    useClass: ReadUserRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];