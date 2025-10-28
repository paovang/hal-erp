import { Injectable } from '@nestjs/common';
import { CreateProductTypeDto } from '../dto/create/product-type/create.dto';
import { ProductTypeEntity } from '../../domain/entities/product-type.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { ProductTypeResponse } from '../dto/response/product-type.response';
import { UpdateProductTypeDto } from '../dto/create/product-type/update.dto';

@Injectable()
export class ProductTypeDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreateProductTypeDto | UpdateProductTypeDto): ProductTypeEntity {
    const builder = ProductTypeEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if ('category_id' in dto && dto.category_id) {
      builder.setCategoryId(dto.category_id);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: ProductTypeEntity): ProductTypeResponse {
    const response = new ProductTypeResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.category_id = entity.categoryId;
    response.category = entity.category;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}