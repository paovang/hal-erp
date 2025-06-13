import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class ApprovalWorkflowStepQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: '',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
