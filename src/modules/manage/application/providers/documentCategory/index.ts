import { Provider } from '@nestjs/common';
import {
  DOCUMENT_CATEGORY_APPLICATION_SERVICE,
  DOCUMENT_TYPE_APPLICATION_SERVICE,
  READ_DOCUMENT_CATEGORY_REPOSITORY,
  READ_DOCUMENT_TYPE_REPOSITORY,
  WRITE_DOCUMENT_TYPE_REPOSITORY,
} from '../../constants/inject-key.const';
import { DocumentTypeService } from '../../services/document-type.service';
import { WriteDocumentTypeRepository } from '@src/modules/manage/infrastructure/repositories/documentType/write.repository';
import { DocumentCategoryMapperProviders } from './mapper.provider';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import { ReadDocumentTypeRepository } from '@src/modules/manage/infrastructure/repositories/documentType/read.repository';
import { DocumentCategoryHandlersProviders } from './command.provider';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { TransformResultService } from '@src/common/utils/services/transform-result.service';
import { DocumentCategoryService } from '../../services/document-category.service';
import { ReadDocumentCategoryRepository } from '@src/modules/manage/infrastructure/repositories/documentCategory/read.repository';

export const DocumentCategoryProvider: Provider[] = [
  ...DocumentCategoryHandlersProviders,
  ...DocumentCategoryMapperProviders,
  // CodeGeneratorUtil,
  {
    provide: DOCUMENT_CATEGORY_APPLICATION_SERVICE,
    useClass: DocumentCategoryService,
  },
  // {
  //   provide: WRITE_DOCUMENT_TYPE_REPOSITORY,
  //   useClass: WRITE_DOCUMENT_CATEGORY_REPOSITORY,
  // },
  {
    provide: READ_DOCUMENT_CATEGORY_REPOSITORY,
    useClass: ReadDocumentCategoryRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
