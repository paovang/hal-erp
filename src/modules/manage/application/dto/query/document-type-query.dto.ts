import { ApiProperty } from '@nestjs/swagger';
import { DocumentCategoryCode } from '@src/common/infrastructure/database/typeorm/document-category.orm';
import { PaginationDto } from '@src/common/validations/dto/pagination.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class DocumentTypeQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'can be code, name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  company_id?: string;

  @IsOptional()
  @IsEnum(DocumentCategoryCode, {
    message: `category must be a valid DocumentCategoryCode`,
  })
  category?: DocumentCategoryCode;
}
