import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { WRITE_POSITION_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWritePositionRepository } from '@src/modules/manage/domain/ports/output/position-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PositionOrmEntity } from '@src/common/infrastructure/database/typeorm/position.orm';
import { PositionId } from '@src/modules/manage/domain/value-objects/position-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { checkRelationOrThrow } from '@src/common/utils/check-relation-or-throw.util';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_POSITION_REPOSITORY)
    private readonly _write: IWritePositionRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    await this.checkData(query);

    return await this._write.delete(new PositionId(query.id), query.manager);
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, PositionOrmEntity, {
      id: query.id,
    });

    await checkRelationOrThrow(
      query.manager,
      DepartmentUserOrmEntity,
      { position_id: query.id },
      'errors.already_in_use',
    );
  }
}
