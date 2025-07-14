import { Provider } from '@nestjs/common';
import { DocumentApproverDataMapper } from '../../mappers/document-approver.mapper';
import { DocumentApproverDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-approver.mapper';

export const DocumentApproverMapperProviders: Provider[] = [
  DocumentApproverDataAccessMapper,
  DocumentApproverDataMapper,
];
