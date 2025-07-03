import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '@src/modules/manage/application/commands/documentType/create.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DocumentTypeEntity } from '@src/modules/manage/domain/entities/document-type.entity';
import {
  LENGTH_DOCUMENT_TYPE_CODE,
  WRITE_DOCUMENT_TYPE_REPOSITORY,
} from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { IWriteDocumentTypeRepository } from '@src/modules/manage/domain/ports/output/document-type-repository.interface';
import { DocumentTypeDataMapper } from '../../../mappers/document-type.mapper';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';

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
    let code = query.dto.code;

    await _checkColumnDuplicate(
      DocumentTypeOrmEntity,
      'name',
      query.dto.name,
      query.manager,
      'errors.name_already_exists',
    );

    if (!code) {
      code = await this._codeGeneratorUtil.generateUniqueCode(
        LENGTH_DOCUMENT_TYPE_CODE,
        async (generatedCode: string) => {
          try {
            await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
              code: generatedCode,
            });
            return false;
          } catch {
            return true;
          }
        },
        'DT',
      );
    } else {
      // Remove 'DT-' prefix if it already exists (case-insensitive optional)
      const cleanCode = code.toUpperCase().startsWith('DT-')
        ? code.slice(3)
        : code;

      code = `DT-${cleanCode.toUpperCase()}`;

      await _checkColumnDuplicate(
        DocumentTypeOrmEntity,
        'code',
        code,
        query.manager,
        'Code already exists',
      );
    }

    const entity = this._dataMapper.toEntity(query.dto, code);
    return await this._write.create(entity, query.manager);
  }
}
