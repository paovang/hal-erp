import { Provider } from '@nestjs/common';
import { GetAllQueryHandler } from '../../queries/Province/handler/get-all.command.query';

export const ProvinceHandlersProviders: Provider[] = [GetAllQueryHandler];
