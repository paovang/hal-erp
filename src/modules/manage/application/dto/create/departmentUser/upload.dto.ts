import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsOptional()
  file: string[];
}
