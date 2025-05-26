import { PartialType } from '@nestjs/swagger';
import { CurrencyDto } from './create.dto';

export class UpdateCurrencyDto extends PartialType(CurrencyDto) {}
