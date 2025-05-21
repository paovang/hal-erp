import { Provider } from "@nestjs/common";
import { UserDataMapper } from "../../mappers/user.mapper";
import { UserDataAccessMapper } from "@src/modules/manage/infrastructure/mappers/user.mapper";

export const UserMapperProviders: Provider[] = [
    UserDataAccessMapper,
    UserDataMapper,
];