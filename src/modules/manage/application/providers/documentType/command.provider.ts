import { Provider } from "@nestjs/common";
import { CreateCommandHandler } from "../../commands/documentType/handler/create-command.handler";

export const DocumentTypeHandlersProviders: Provider[] = [
  CreateCommandHandler,
];