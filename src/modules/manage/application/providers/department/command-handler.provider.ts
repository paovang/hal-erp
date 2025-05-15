import { Provider } from '@nestjs/common';
import { GetAllQueryHandler } from '@src/modules/manage/application/queries/department/handler/get-all.command.query';

export const DepartmentHandlersProviders: Provider[] = [GetAllQueryHandler];
