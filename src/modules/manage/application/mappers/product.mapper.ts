import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create/product/create.dto';
import { ProductEntity } from '../../domain/entities/product.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { ProductResponse } from '../dto/response/product.response';
import { UpdateProductDto } from '../dto/create/product/update.dto';

@Injectable()
export class ProductDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreateProductDto | UpdateProductDto): ProductEntity {
    const builder = ProductEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if (dto.description) {
      builder.setDescription(dto.description);
    }

    if ('product_type_id' in dto && dto.product_type_id) {
      builder.setProductTypeId(dto.product_type_id);
    }

    if ('status' in dto && dto.status) {
      builder.setStatus(dto.status);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: ProductEntity): ProductResponse {
    const response = new ProductResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.description = entity.description;
    response.product_type_id = entity.productTypeId;
    response.product_type = entity.productType;
    response.status = entity.status;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
