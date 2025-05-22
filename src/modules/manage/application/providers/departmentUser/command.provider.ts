import { Provider } from "@nestjs/common";
import { CreateCommandHandler } from "../../commands/departmentUser/handler/create-command.handler";
import { GetAllQueryHandler } from "../../queries/departmentUser/handler/get-all.command.query";

export const DepartmentUserHandlersProviders: Provider[] = [
    CreateCommandHandler,
    GetAllQueryHandler
];