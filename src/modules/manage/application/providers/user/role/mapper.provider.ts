import { Provider } from "@nestjs/common";
import { RoleDataMapper } from "../../../mappers/role.mapper";
import { RoleDataAccessMapper } from "@src/modules/manage/infrastructure/mappers/role.mapper";

export const RoleMapperProviders: Provider[] = [
    RoleDataAccessMapper,
    RoleDataMapper
];