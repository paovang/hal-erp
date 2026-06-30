import { Provider } from '@nestjs/common';
import { UpdateCommandHandler } from '../../commands/documentAttachment/handler/update.command.handler';

export const DocumentAttachmentHandlersProviders: Provider[] = [
  UpdateCommandHandler,
];
