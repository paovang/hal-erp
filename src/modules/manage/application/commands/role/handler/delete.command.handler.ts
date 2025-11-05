import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_ROLE_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteRoleRepository } from '@src/modules/manage/domain/ports/output/role-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { RoleId } from '@src/modules/manage/domain/value-objects/role-id.vo';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_ROLE_REPOSITORY)
    private readonly _write: IWriteRoleRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    /** Check Exits Document Type Id */
    const role = await findOneOrFail(query.manager, RoleOrmEntity, {
      id: query.id,
    });

    if (
      (role && role.name === 'super-admin') ||
      role.name === 'admin' ||
      role.name === 'company-admin' ||
      role.name === 'company-user'
    ) {
      throw new ManageDomainException(
        'errors.cannot_delete_role',
        HttpStatus.BAD_REQUEST,
        { property: `${role.name}` },
      );
    }

    return await this._write.delete(new RoleId(query.id), query.manager);
  }
}
