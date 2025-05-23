import { Provider } from "@nestjs/common";
import { CreateCommandHandler } from "../../commands/position/handler/create-command.handler";
import { GetAllQueryHandler } from "../../queries/position/handler/get-all.command.query";
import { GetOneQueryHandler } from "../../queries/position/handler/get-one.command.query";
import { UpdateCommandHandler } from "../../commands/position/handler/update-command.handler";
import { DeleteCommandHandler } from "../../commands/position/handler/delete-command.handler";

export const PositionHandlersProviders: Provider[] = [
    CreateCommandHandler,
    GetAllQueryHandler,
    GetOneQueryHandler,
    UpdateCommandHandler,
    DeleteCommandHandler
];