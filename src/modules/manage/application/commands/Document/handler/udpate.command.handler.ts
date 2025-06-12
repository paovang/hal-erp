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
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<DocumentEntity>>
{
  constructor(
    @Inject(WRITE_DOCUMENT_REPOSITORY)
    private readonly _write: IWriteDocumentRepository,
    private readonly _dataMapper: DocumentDataMapper,
  ) {}

  async execute(query: UpdateCommand): Promise<ResponseResult<DocumentEntity>> {
    await this.checkData(query);

    const entity = this._dataMapper.toEntity(query.dto);

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

    await findOneOrFail(query.manager, UserOrmEntity, {
      id: query.dto.requesterId,
    });

    await findOneOrFail(query.manager, DepartmentUserOrmEntity, {
      department_id: query.dto.departmentId,
      user_id: query.dto.requesterId,
    });
  }
}
