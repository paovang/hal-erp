import { ApiProperty } from "@nestjs/swagger";
import { PaginationDto } from "@src/common/validations/dto/pagination.dto";
import { IsOptional, IsString } from "class-validator";

export class PermissionQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be name',
  })
  @IsOptional()
  @IsString()
  search?: string;
}