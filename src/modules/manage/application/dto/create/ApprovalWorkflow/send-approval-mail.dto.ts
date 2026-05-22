import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SendApprovalMailDto {
  @ApiProperty({ example: 12 })
  @IsDefined({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  @IsPositive({ message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly approver_user_id: number;

  @ApiPropertyOptional({
    example: 'ขออนุมัติเร่งด่วนภายในวันนี้',
    description: 'ข้อความเพิ่มเติมที่จะแสดงในอีเมล',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly description?: string;
}
