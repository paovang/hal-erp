import { PartialType } from '@nestjs/swagger';
import { CreateExchangeRateType } from './create.dto';

export class UpdateExchangeRateDto extends PartialType(
  CreateExchangeRateType,
) {}
