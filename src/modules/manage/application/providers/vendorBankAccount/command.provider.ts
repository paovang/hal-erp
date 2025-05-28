import { Provider } from '@nestjs/common';
import { CreateCommandHandler } from '../../commands/vendorBankAccount/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/vendorBankAccount/handler/get-all.command.query';
import { GetOneQueryHandler } from '../../queries/vendorBankAccount/handler/get-one.command.query';
import { UpdateCommandHandler } from '../../commands/vendorBankAccount/handler/update-command.handler';
import { DeleteCommandHandler } from '../../commands/vendorBankAccount/handler/delete-command.handler';
import { UseBankAccountCommandHandler } from '../../commands/vendorBankAccount/handler/use-bank-account-command.handler';

export const VendorBankAccountHandlersProviders: Provider[] = [
  CreateCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
  UpdateCommandHandler,
  DeleteCommandHandler,
  UseBankAccountCommandHandler,
];
