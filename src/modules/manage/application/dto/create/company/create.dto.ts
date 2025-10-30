import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsEqualTo } from '@src/common/decorators/is-equal-to.decorator';

// --- Start of CompanyUserDto ---
export class CompanyUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Matches(/^\S+$/, {
    message: i18nValidationMessage('validation.NO_SPACES_ALLOWED'),
  })
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.IS_EMAIL') })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @Length(6, 20, { message: i18nValidationMessage('validation.TEL_LENGTH') })
  @Matches(/^\d+$/, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly tel: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(6, 255, {
    message: i18nValidationMessage('validation.PASSWORD_LENGTH'),
  })
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEqualTo('password', {
    message: i18nValidationMessage('validation.PASSWORD_MISMATCH'),
  })
  readonly confirm_password: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly signature: string;
}
// --- End of CompanyUserDto ---

// --- Start of CreateCompanyDto ---
export class CreateCompanyDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(255, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly logo?: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MinLength(7, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  readonly tel: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.IS_EMAIL') })
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly address?: string;

  @ApiProperty({ type: CompanyUserDto })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @ValidateNested({
    message: i18nValidationMessage('validation.INVALID_USER_OBJECT'),
  })
  @Type(() => CompanyUserDto)
  readonly user: CompanyUserDto;
}
// --- End of CreateCompanyDto ---
