import { Provider } from "@nestjs/common";
import { DepartmentUserDataMapper } from "../../mappers/department-user.mapper";
import { DepartmentUserDataAccessMapper } from "@src/modules/manage/infrastructure/mappers/department-user.mapper";

export const DepartmentUserMapperProviders: Provider[] = [
    DepartmentUserDataAccessMapper,
    DepartmentUserDataMapper,
];