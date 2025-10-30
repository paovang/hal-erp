import { Provider } from '@nestjs/common';
import { CreateCompanyUserCommandHandler } from '../../commands/companyUser/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/companyUser/handler/get-all-query.handler';

export const HandlersProviders: Provider[] = [
  CreateCompanyUserCommandHandler,
  GetAllQueryHandler,
];
