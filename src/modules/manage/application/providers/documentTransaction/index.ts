import { Provider } from '@nestjs/common';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import { DocumentTransactionHandlersProviders } from './command.provider';
import { DocumentTransactionMapperProviders } from './mapper.provider';
import { WriteDocumentTransactionRepository } from '@src/modules/manage/infrastructure/repositories/documentTransaction/write.repository';
import { WRITE_DOCUMENT_TRANSACTION_REPOSITORY } from '../../constants/inject-key.const';

export const DocumentTransactionProvider: Provider[] = [
  ...DocumentTransactionHandlersProviders,
  ...DocumentTransactionMapperProviders,
  CodeGeneratorUtil,
  {
    provide: WRITE_DOCUMENT_TRANSACTION_REPOSITORY,
    useClass: WriteDocumentTransactionRepository,
  },
  //   {
  //     provide: READ_DOCUMENT_TYPE_REPOSITORY,
  //     useClass: ReadDocumentTypeRepository,
  //   },
];
