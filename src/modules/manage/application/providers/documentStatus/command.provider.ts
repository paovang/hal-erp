import { Provider } from '@nestjs/common';
import { GetAllQueryHandler } from '../../queries/documentStatus/hendler/get-all.command.query';

export const DocumentStatusHandlersProviders: Provider[] = [GetAllQueryHandler];
