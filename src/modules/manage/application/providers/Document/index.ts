import { Provider } from '@nestjs/common';
import { DocumentHandlersProviders } from './command.provider';
import { DocumentMapperProviders } from './mapper.provider';
import {
  DOCUMENT_APPLICATION_SERVICE,
  READ_DOCUMENT_REPOSITORY,
  WRITE_DOCUMENT_REPOSITORY,
} from '../../constants/inject-key.const';
import { WriteDocumentRepository } from '@src/modules/manage/infrastructure/repositories/document/write.repository';
import { DocumentService } from '../../services/document.service';
import { ReadDocumentRepository } from '@src/modules/manage/infrastructure/repositories/document/read.repository';

export const DocumentProvider: Provider[] = [
  ...DocumentHandlersProviders,
  ...DocumentMapperProviders,
  {
    provide: DOCUMENT_APPLICATION_SERVICE,
    useClass: DocumentService,
  },
  {
    provide: WRITE_DOCUMENT_REPOSITORY,
    useClass: WriteDocumentRepository,
  },
  {
    provide: READ_DOCUMENT_REPOSITORY,
    useClass: ReadDocumentRepository,
  },
];
