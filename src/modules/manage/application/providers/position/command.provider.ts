import { Provider } from "@nestjs/common";
import { CreateCommandHandler } from "../../commands/position/handler/create-command.handler";
import { GetAllQueryHandler } from "../../queries/position/handler/get-all.command.query";
import { GetOneQueryHandler } from "../../queries/position/handler/get-one.command.query";

export const PositionHandlersProviders: Provider[] = [
    CreateCommandHandler,
    GetAllQueryHandler,
    GetOneQueryHandler
];