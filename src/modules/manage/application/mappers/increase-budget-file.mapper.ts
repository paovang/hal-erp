import { Injectable } from '@nestjs/common';
import { IncreaseBudgetFileEntity } from '../../domain/entities/increase-budget-file.entity';
import { IncreaseBudgetFileResponse } from '../dto/response/increase-budget-file.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { CreateIncreaseBudgetDto } from '../dto/create/increaseBudget/create.dto';
import { UpdateIncreaseBudgetDto } from '../dto/create/increaseBudget/update.dto';

@Injectable()
export class IncreaseBudgetFileDataMapper {
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateIncreaseBudgetDto | UpdateIncreaseBudgetDto,
    increase_budget_id?: number,
  ): IncreaseBudgetFileEntity {
    const builder = IncreaseBudgetFileEntity.builder();

    if (dto.file_name) {
      builder.setFileName(dto.file_name);
    }

    if (increase_budget_id) {
      builder.setIncreaseBudgetId(increase_budget_id);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: IncreaseBudgetFileEntity): IncreaseBudgetFileResponse {
    const file = entity?.file_name
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${entity.file_name}`
      : '';
    const response = new IncreaseBudgetFileResponse();
    response.id = Number(entity.getId().value);
    response.Increase_budget_id = entity.increase_budget_id;
    response.file_name = entity.file_name;
    response.file_name_url = file;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
