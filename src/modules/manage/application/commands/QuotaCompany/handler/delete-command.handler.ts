import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { WRITE_QUOTA_COMPANY_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IWriteQuotaCompanyRepository } from '@src/modules/manage/domain/ports/output/quota-company-repository.interface';
import { QuotaCompanyId } from '@src/modules/manage/domain/value-objects/quota-company-id.vo';
import { QuotaCompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/quota-company.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements ICommandHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_QUOTA_COMPANY_REPOSITORY)
    private readonly _write: IWriteQuotaCompanyRepository,
  ) {}

  async execute(command: DeleteCommand): Promise<void> {
    await this.checkData(command);

    const quotaId = new QuotaCompanyId(command.id);
    await this._write.delete(quotaId, command.manager);
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }
    /** Check Exits ProductTypeId Id */
    await findOneOrFail(query.manager, QuotaCompanyOrmEntity, {
      id: query.id,
    });
  }
}
