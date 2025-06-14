import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentEntity } from '@src/modules/manage/domain/entities/document.entity';
import { Inject } from '@nestjs/common';
import {
  LENGTH_DOCUMENT_CODE,
  WRITE_DOCUMENT_REPOSITORY,
} from '../../../constants/inject-key.const';
import { DocumentDataMapper } from '../../../mappers/document.mapper';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { IWriteDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { DocumentEntityMode } from '@src/common/utils/orm-entity-method.enum';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<DocumentEntity>>
{
  constructor(
    @Inject(WRITE_DOCUMENT_REPOSITORY)
    private readonly _write: IWriteDocumentRepository,
    private readonly _dataMapper: DocumentDataMapper,
    private readonly _codeGeneratorUtil: CodeGeneratorUtil,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: CreateCommand): Promise<ResponseResult<DocumentEntity>> {
    const user = this._userContextService.getAuthUser()?.user;
    const user_id = (user as any).id;

    await this.checkData(query);

    const code = await this.generateCode(query);

    const entity = this._dataMapper.toEntity(
      query.dto,
      DocumentEntityMode.CREATE,
      code,
      user_id,
    );
    return await this._write.create(entity, query.manager);
  }

  private async checkData(query: CreateCommand): Promise<void> {
    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.dto.departmentId,
    });

    await findOneOrFail(query.manager, DocumentOrmEntity, {
      id: query.dto.documentTypeId,
    });
  }

  private async generateCode(query: CreateCommand): Promise<string> {
    return await this._codeGeneratorUtil.generateUniqueCode(
      LENGTH_DOCUMENT_CODE,
      async (generatedCode: string) => {
        try {
          await findOneOrFail(query.manager, DocumentOrmEntity, {
            document_number: generatedCode,
          });
          return false;
        } catch {
          return true;
        }
      },
      'D',
    );
  }
}
