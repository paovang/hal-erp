import { PartialType } from '@nestjs/swagger';
import { CreateBudgetItemDetailDto } from './create.dto';

export class UpdateBudgetItemDetailDto extends PartialType(
  CreateBudgetItemDetailDto,
) {}
