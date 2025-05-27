import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class VendorBankAccountQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be bank_name, account_name, account_number',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
