import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateDocumentAttachmentDto {
  @ApiProperty()
  @IsOptional()
  readonly file_name?: string;
}
