import { OmitType } from '@nestjs/swagger';
import { CreateBudgetItemDto } from './create.dto';

export class UpdateBudgetItemDto extends OmitType(CreateBudgetItemDto, [
  'budget_accountId',
] as const) {}
