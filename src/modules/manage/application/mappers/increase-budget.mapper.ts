import { IncreaseBudgetEntity } from '../../domain/entities/increase-budget.entity';
import { IncreaseBudgetResponse } from '../dto/response/increase-budget.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { CreateIncreaseBudgetDto } from '../dto/create/increaseBudget/create.dto';
import { BudgetAccountDataMapper } from './budget-account.mapper';
import { Injectable } from '@nestjs/common';
import { UpdateIncreaseBudgetDto } from '../dto/create/increaseBudget/update.dto';
import { IncreaseBudgetFileDataMapper } from './increase-budget-file.mapper';
import { UserDataMapper } from './user.mapper';

@Injectable()
export class IncreaseBudgetDataMapper {
  constructor(
    private readonly budget_account: BudgetAccountDataMapper,
    private readonly increase_budget_file: IncreaseBudgetFileDataMapper,
    private readonly create_by: UserDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateIncreaseBudgetDto | UpdateIncreaseBudgetDto,
    created_by?: number,
    allocated_amount?: number,
  ): IncreaseBudgetEntity {
    const builder = IncreaseBudgetEntity.builder();

    if (dto.budget_account_id) {
      builder.setBudgetAccountId(dto.budget_account_id);
    }

    if (allocated_amount) {
      builder.setAllocatedAmount(allocated_amount);
    }

    if (dto.description) {
      builder.setDescription(dto.description);
    }

    if (created_by) {
      builder.setCreatedBy(created_by);
    }

    return builder.build();
  }

  toEntityUpdate(allocated_amount?: number): IncreaseBudgetEntity {
    const builder = IncreaseBudgetEntity.builder();

    if (allocated_amount) {
      builder.setAllocatedAmount(allocated_amount);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: IncreaseBudgetEntity): IncreaseBudgetResponse {
    const response = new IncreaseBudgetResponse();
    response.id = Number(entity.getId().value);
    response.budget_account_id = entity.budget_account_id;
    response.allocated_amount = entity.allocated_amount;
    response.description = entity.description;
    response.import_date = moment
      .tz(entity.import_date, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.created_by = entity.created_by;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.budget_account = entity.budget_account
      ? this.budget_account.toResponse(entity.budget_account)
      : null;

    response.created_by_user = entity.created_by_user
      ? this.create_by.toResponse(entity.created_by_user)
      : null;

    response.increase_budget_files = entity.increase_budget_file
      ? entity.increase_budget_file.map((file) =>
          this.increase_budget_file.toResponse(file),
        )
      : null;

    return response;
  }
}
