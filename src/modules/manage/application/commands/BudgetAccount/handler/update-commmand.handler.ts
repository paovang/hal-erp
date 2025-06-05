import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetAccountEntity } from '@src/modules/manage/domain/entities/budget-account.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_BUDGET_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteBudgetAccountRepository } from '@src/modules/manage/domain/ports/output/budget-account-repository.interface';
import { BudgetAccountDataMapper } from '../../../mappers/budget-account.mapper';
import { BudgetAccountId } from '@src/modules/manage/domain/value-objects/budget-account-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<BudgetAccountEntity>>
{
  constructor(
    @Inject(WRITE_BUDGET_ACCOUNT_REPOSITORY)
    private readonly _write: IWriteBudgetAccountRepository,
    private readonly _dataMapper: BudgetAccountDataMapper,
  ) {}

  async execute(query: UpdateCommand): Promise<any> {
    await this.checkData(query);

    const entity = this._dataMapper.toEntity(query.dto);
    await entity.initializeUpdateSetId(new BudgetAccountId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department Id */
    await findOneOrFail(query.manager, BudgetAccountOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
  }

  private async checkData(query: UpdateCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.dto.departmentId,
    });
  }
}
