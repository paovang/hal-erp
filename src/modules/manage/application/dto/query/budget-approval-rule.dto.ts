import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class BudgetApprovalRuleQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be username, email, tel',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
