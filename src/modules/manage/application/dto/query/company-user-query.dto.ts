import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class CompanyUserQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be name, email, tel',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'validation.IS_STRING' })
  company_id: string;
}
