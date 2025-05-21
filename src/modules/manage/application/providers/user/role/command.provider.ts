import { Provider } from "@nestjs/common";
import { GetAllQueryHandler } from "../../../queries/user/role/handler/get-all.command.query";
import { GetOneQueryHandler } from "../../../queries/user/role/handler/get-one.command.query";

export const RoleHandlersProviders: Provider[] = [
    GetAllQueryHandler,
    GetOneQueryHandler
];