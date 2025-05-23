import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create/category/create.dto';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { CategoryResponse } from '../dto/response/category.response';
import { UpdateCategoryDto } from '../dto/create/category/update.dto';

@Injectable()
export class CategoryDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreateCategoryDto | UpdateCategoryDto): CategoryEntity {
    const builder = CategoryEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: CategoryEntity): CategoryResponse {
    const response = new CategoryResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
