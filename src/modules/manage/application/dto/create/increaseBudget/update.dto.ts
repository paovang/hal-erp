import { OmitType } from '@nestjs/swagger';
import { CreateIncreaseBudgetDto } from './create.dto';

export class UpdateIncreaseBudgetDto extends OmitType(CreateIncreaseBudgetDto, [
  'increase_budget_details',
]) {}
