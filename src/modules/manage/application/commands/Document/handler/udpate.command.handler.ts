import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentEntity } from '@src/modules/manage/domain/entities/document.entity';
import { WRITE_DOCUMENT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { DocumentDataMapper } from '../../../mappers/document.mapper';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { DocumentId } from '@src/modules/manage/domain/value-objects/document-id.vo';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';
import { DocumentEntityMode } from '@src/common/utils/orm-entity-method.enum';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<DocumentEntity>>
{
  constructor(
    @Inject(WRITE_DOCUMENT_REPOSITORY)
    private readonly _write: IWriteDocumentRepository,
    private readonly _dataMapper: DocumentDataMapper,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: UpdateCommand): Promise<ResponseResult<DocumentEntity>> {
    await this.checkData(query);
    const user = this._userContextService.getAuthUser()?.user;
    const user_id = (user as any).id;

    const entity = this._dataMapper.toEntity(
      query.dto,
      DocumentEntityMode.UPDATE,
      user_id,
    );

    await entity.initializeUpdateSetId(new DocumentId(query.id));
    await entity.validateExistingIdForUpdate();

    await findOneOrFail(query.manager, DocumentOrmEntity, {
      id: entity.getId().value,
    });

    return this._write.update(entity, query.manager);
  }

  private async checkData(query: UpdateCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, DocumentOrmEntity, {
      id: query.id,
    });

    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.dto.departmentId,
    });

    await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
      id: query.dto.documentTypeId,
    });
  }
}
