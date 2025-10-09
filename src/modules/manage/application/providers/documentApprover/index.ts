import { Provider } from '@nestjs/common';
import { DocumentApproverHandlersProviders } from './command.provider';
import { DocumentApproverMapperProviders } from './mapper.provider';
import { WRITE_DOCUMENT_APPROVER_REPOSITORY } from '../../constants/inject-key.const';
import { WriteDocumentApproverRepository } from '@src/modules/manage/infrastructure/repositories/documentApprover/write.repository';

export const DocumentApproverProvider: Provider[] = [
  ...DocumentApproverHandlersProviders,
  ...DocumentApproverMapperProviders,
  {
    provide: WRITE_DOCUMENT_APPROVER_REPOSITORY,
    useClass: WriteDocumentApproverRepository,
  },
];
