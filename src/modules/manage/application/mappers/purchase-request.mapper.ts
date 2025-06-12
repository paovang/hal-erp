import { Injectable } from '@nestjs/common';
import { PurchaseRequestEntity } from '../../domain/entities/purchase-request.entity';
import { PurchaseRequestResponse } from '../dto/response/purchase-request.response';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { CreatePurchaseRequestDto } from '../dto/create/purchaseRequest/create.dto';

@Injectable()
export class PurchaseRequestDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreatePurchaseRequestDto): PurchaseRequestEntity {
    const builder = PurchaseRequestEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: PurchaseRequestEntity): PurchaseRequestResponse {
    const response = new PurchaseRequestResponse();
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
