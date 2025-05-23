import { Injectable } from "@nestjs/common";
import { CreatePositionDto } from "../dto/create/position/create.dto";
import { PositionResponse } from "../dto/response/position.response";
import { PositionEntity } from "../../domain/entities/position.entity";
import { Timezone } from "@src/common/domain/value-objects/timezone.vo";
import { DateFormat } from "@src/common/domain/value-objects/date-format.vo";
import moment from 'moment-timezone';
import { UpdatePositionDto } from "../dto/create/position/update.dto";

@Injectable()
export class PositionDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreatePositionDto | UpdatePositionDto): PositionEntity {
    const builder = PositionEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: PositionEntity): PositionResponse {
    const response = new PositionResponse();
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