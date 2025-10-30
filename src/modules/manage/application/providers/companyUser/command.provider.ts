import { Provider } from '@nestjs/common';
import { CreateCompanyUserCommandHandler } from '../../commands/companyUser/handler/create-command.handler';
import { GetAllQueryHandler } from '../../queries/companyUser/handler/get-all-query.handler';
import { GetOneQueryHandler } from '../../queries/companyUser/handler/get-one-query.handler';
import { UpdateCompanyUserCommandHandler } from '../../commands/companyUser/handler/update-command.handler';
import { DeleteCompanyUserCommandHandler } from '../../commands/companyUser/handler/delete-command.handler';

export const HandlersProviders: Provider[] = [
  CreateCompanyUserCommandHandler,
  UpdateCompanyUserCommandHandler,
  DeleteCompanyUserCommandHandler,
  GetAllQueryHandler,
  GetOneQueryHandler,
];
