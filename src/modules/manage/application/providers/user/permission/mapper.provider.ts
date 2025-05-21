import { Provider } from "@nestjs/common";
import { PermissionDataAccessMapper } from "@src/modules/manage/infrastructure/mappers/permission.mapper";
import { PermissionDataMapper } from "../../../mappers/permission.mapper";

export const PermissionMapperProviders: Provider[] = [
    PermissionDataAccessMapper,
    PermissionDataMapper
];