import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class ApprovalWorkflowQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be document_type_name, name',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
