import { Injectable } from '@nestjs/common';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { CreateVatDto } from '../dto/create/vat/create.dto';
import { UpdateVatDto } from '../dto/create/vat/update.dto';
import { VatEntity } from '../../domain/entities/vat.entity';
import { VatResponse } from '../dto/response/vat.response';

@Injectable()
export class VatDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreateVatDto | UpdateVatDto): VatEntity {
    const builder = VatEntity.builder();

    if (dto.amount) {
      builder.setAmount(dto.amount);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: VatEntity): VatResponse {
    const response = new VatResponse();
    response.id = entity.getId().value;
    response.amount = entity.amount;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
