import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create/user/create.dto';
import { UserSignatureEntity } from '../../domain/entities/user-signature.entity';
import { UserSignatureResponse } from '../dto/response/user-signature.response';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { UpdateUserDto } from '../dto/create/user/update.dto';
import { CompanyUserDto } from '../dto/create/company/create.dto';

@Injectable()
export class UserSignatureDataMapper {
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateUserDto | UpdateUserDto | CompanyUserDto,
    user_id?: number,
  ): UserSignatureEntity {
    const builder = UserSignatureEntity.builder();
    if (user_id) {
      builder.setUserId(user_id);
    }

    if (dto.signature) {
      builder.setSignature(dto.signature);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: UserSignatureEntity): UserSignatureResponse {
    const file = entity?.signature
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${entity.signature}`
      : '';

    const response = new UserSignatureResponse();
    response.id = entity.getId().value;
    response.user_id = entity.userId;
    response.signature = entity.signature ?? null;
    response.signature_url = file;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
