import { Provider } from "@nestjs/common";
import { CreateCommandHandler } from "../../commands/departmentUser/handler/create-command.handler";

export const DepartmentUserHandlersProviders: Provider[] = [
    CreateCommandHandler
];