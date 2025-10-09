import { PartialType } from '@nestjs/swagger';
import { CreateBudgetAccountDto } from './create.dto';

export class UpdateBudgetAccountDto extends PartialType(
  CreateBudgetAccountDto,
) {}
