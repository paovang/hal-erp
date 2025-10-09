import { Provider } from '@nestjs/common';
import { GetAllBankQueryHandler } from '../../queries/banks/handler/get-all.command.query';
import { GetOneBankQueryHandler } from '../../queries/banks/handler/get-one.command.query';
import { UpdateBankCommandHandler } from '../../commands/banks/handler/update-command.handler';
import { DeleteBankCommandHandler } from '../../commands/banks/handler/delete-command.handler';
import { CreateBankCommandHandler } from '../../commands/banks/handler/create-command.handler';

export const BankHandlersProviders: Provider[] = [
  CreateBankCommandHandler,
  GetAllBankQueryHandler,
  GetOneBankQueryHandler,
  UpdateBankCommandHandler,
  DeleteBankCommandHandler,
];
