import { Provider } from "@nestjs/common";
import { DocumentTypeHandlersProviders } from "@src/modules/manage/application/providers/documentType/command.provider";
import { DOCUMENT_TYPE_APPLICATION_SERVICE, READ_DOCUMENT_TYPE_REPOSITORY, WRITE_DOCUMENT_TYPE_REPOSITORY } from "../../constants/inject-key.const";
import { TRANSFORM_RESULT_SERVICE } from "@src/common/constants/inject-key.const";
import { TransformResultService } from "@src/common/utils/services/transform-result.service";
import { DocumentTypeService } from "../../services/document-type.service";
import { WriteDocumentTypeRepository } from "@src/modules/manage/infrastructure/repositories/documentType/write.repository";
import { DocumentTypeMapperProviders } from "./mapper.provider";
import { CodeGeneratorUtil } from "@src/common/utils/code-generator.util";
import { ReadDocumentTypeRepository } from "@src/modules/manage/infrastructure/repositories/documentType/read.repository";

export const DocumentTypeProvider: Provider[] = [
  ...DocumentTypeHandlersProviders,
  ...DocumentTypeMapperProviders,
  CodeGeneratorUtil,
  {
    provide: DOCUMENT_TYPE_APPLICATION_SERVICE,
    useClass: DocumentTypeService,
  },
  {
    provide: WRITE_DOCUMENT_TYPE_REPOSITORY,
    useClass: WriteDocumentTypeRepository,
  },
  {
    provide: READ_DOCUMENT_TYPE_REPOSITORY,
    useClass: ReadDocumentTypeRepository,
  },
  {
    provide: TRANSFORM_RESULT_SERVICE,
    useClass: TransformResultService,
  },
];
