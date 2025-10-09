import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { ProvinceEntity } from '../../domain/entities/province.entity';
import { Injectable } from '@nestjs/common';
import { ProvinceResponse } from '../dto/response/province.response';

@Injectable()
export class ProvinceDataMapper {
  /** Mapper Entity To Response */
  toResponse(entity: ProvinceEntity): ProvinceResponse {
    const response = new ProvinceResponse();
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
