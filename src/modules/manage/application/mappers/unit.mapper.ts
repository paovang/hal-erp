import { Injectable } from "@nestjs/common";
import { CreateUnitDto } from "../dto/create/unit/create.dto";
import { UnitEntity } from "../../domain/entities/unit.entity";
import { Timezone } from "@src/common/domain/value-objects/timezone.vo";
import { DateFormat } from "@src/common/domain/value-objects/date-format.vo";
import moment from 'moment-timezone';
import { UnitResponse } from "../dto/response/unit.response";

@Injectable()
export class UnitDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreateUnitDto ): UnitEntity {
    const builder = UnitEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: UnitEntity): UnitResponse {
    const response = new UnitResponse();
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