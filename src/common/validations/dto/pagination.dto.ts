import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ required: false, description: 'Number of items per page' })
  limit?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ required: false, description: 'Current page number' })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Sort field' })
  sort_by?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Sort order (ASC or DESC)' })
  sort_order?: 'ASC' | 'DESC';

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean({
    message: 'use_cursor must be a boolean value',
  })
  @ApiProperty({
    required: false,
    description: 'Use cursor for pagination (true or false)',
    default: false,
  })
  use_cursor: boolean = false;

  //   @IsUUIDv7()
  @IsOptional()
  @ValidateIf((o) => o.use_cursor)
  @ApiProperty({
    required: false,
    description: 'Cursor for the next set of results',
  })
  next_cursor?: string;

  //   @IsUUIDv7()
  @IsOptional()
  @ValidateIf((o) => o.use_cursor)
  @ApiProperty({
    required: false,
    description: 'Cursor for the previous set of results',
  })
  previous_cursor?: string;
}
