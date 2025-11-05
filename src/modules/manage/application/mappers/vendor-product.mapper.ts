import { Injectable } from '@nestjs/common';
import { CreateVendorProductDto } from '../dto/create/vendor-product/create.dto';
import { VendorProductEntity } from '../../domain/entities/vendor-product.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { VendorProductResponse } from '../dto/response/vendor-product.response';
import { UpdateVendorProductDto } from '../dto/create/vendor-product/update.dto';

@Injectable()
export class VendorProductDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreateVendorProductDto | UpdateVendorProductDto): VendorProductEntity {
    const builder = VendorProductEntity.builder();

    if ('vendor_id' in dto && dto.vendor_id) {
      builder.setVendorId(dto.vendor_id);
    }

    if ('product_id' in dto && dto.product_id) {
      builder.setProductId(dto.product_id);
    }

    if ('price' in dto && dto.price !== undefined) {
      builder.setPrice(dto.price);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: VendorProductEntity): VendorProductResponse {
    const response = new VendorProductResponse();
    response.id = entity.getId().value;
    response.vendor_id = entity.vendorId;
    response.product_id = entity.productId;
    response.vendor = entity.vendor;
    response.product = entity.product;
    response.price = entity.price;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}