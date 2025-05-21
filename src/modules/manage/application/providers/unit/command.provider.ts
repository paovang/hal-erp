import { Provider } from "@nestjs/common";
import { CreateCommandHandler } from "../../commands/unit/handler/create-command.handler";
import { GetAllQueryHandler } from "../../queries/unit/handler/get-all.command.query";
import { GetOneQueryHandler } from "../../queries/unit/handler/get-one.command.query";
import { UpdateCommandHandler } from "../../commands/unit/handler/update.command.handler";
import { DeleteCommandHandler } from "../../commands/unit/handler/delete-command.handler";

export const UnitHandlersProviders: Provider[] = [
    CreateCommandHandler,
    GetAllQueryHandler,
    GetOneQueryHandler,
    UpdateCommandHandler,
    DeleteCommandHandler
];