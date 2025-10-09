import { Provider } from '@nestjs/common';
import { CreateVatCommandHandler } from '../../commands/vat/handler/create-command.handler';
import { GetOneVatQueryHandler } from '../../queries/vat/handler/get-one.command.query';
import { UpdateVatCommandHandler } from '../../commands/vat/handler/update.command.handler';
import { DeleteVatCommandHandler } from '../../commands/vat/handler/delete-command.handler';
import { GetAllVatQueryHandler } from '../../queries/vat/handler/get-all.command.query';

export const VatHandlersProviders: Provider[] = [
  CreateVatCommandHandler,
  GetAllVatQueryHandler,
  GetOneVatQueryHandler,
  UpdateVatCommandHandler,
  DeleteVatCommandHandler,
];
