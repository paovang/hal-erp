import { Injectable } from '@nestjs/common';
import { VendorEntity } from '../../domain/entities/vendor.entity';
import { CreateVendorDto } from '../dto/create/vendor/create.dto';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { VendorResponse } from '../dto/response/vendor.response';
import { UpdateVendorDto } from '../dto/create/vendor/update.dto';

@Injectable()
export class VendorDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreateVendorDto | UpdateVendorDto): VendorEntity {
    const builder = VendorEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if (dto.contact_info) {
      builder.setContactInfo(dto.contact_info);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: VendorEntity): VendorResponse {
    const response = new VendorResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.contact_info = entity.contactInfo;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
