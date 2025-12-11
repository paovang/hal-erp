import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CompanyQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be name, email, tel',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class reportHalGroupQueryDto {
  @ApiProperty({
    required: false,
    description: 'can be year',
  })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiProperty({
    required: false,
    description: 'can be department id',
  })
  @IsOptional()
  @IsNumber()
  department_id?: number;

  @ApiProperty({
    required: false,
    description: 'can be company id',
  })
  @IsOptional()
  @IsNumber()
  company_id?: number;
}
