import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { CreateCommand } from '@src/modules/manage/application/commands/documentType/create.command';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { DocumentTypeEntity } from "@src/modules/manage/domain/entities/document-type.entity";
import { WRITE_DOCUMENT_TYPE_REPOSITORY } from "../../../constants/inject-key.const";
import { Inject } from "@nestjs/common";
import { IWriteDocumentTypeRepository } from "@src/modules/manage/domain/ports/output/document-type-repository.interface";
import { DocumentTypeDataMapper } from "../../../mappers/document-type.mapper";
import { CodeGeneratorUtil } from "@src/common/utils/code-generator.util";
import { findOneOrFail } from "@src/common/utils/fine-one-orm.utils";
import { DocumentTypeOrmEntity } from "@src/common/infrastructure/database/typeorm/document-type.orm";

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<DocumentTypeEntity>>
{
  constructor(
    @Inject(WRITE_DOCUMENT_TYPE_REPOSITORY)
    private readonly _write: IWriteDocumentTypeRepository,
    private readonly _dataMapper: DocumentTypeDataMapper,
    private readonly _codeGeneratorUtil: CodeGeneratorUtil,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<DocumentTypeEntity>> {
        const name = await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
            name: query.dto.name,
        });
        
        if (name) {
            throw new Error('Document type name already exists');
        }

      const generateCode = await this._codeGeneratorUtil.generateUniqueCode(
        6,
        async (code: string) => { 
          try {
            
            await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
              code: code,
            });
            
            return false;
          } catch (error) {
            return true;
          }
        },
        'DT'
      );
    
    const mapToEntity = this._dataMapper.toEntity(query.dto, generateCode);
    console.log(mapToEntity);

    return await this._write.create(mapToEntity, query.manager);
  }
}