import { PartialType } from '@nestjs/swagger';
import { CreateIncreaseBudgetDto } from './create.dto';

export class UpdateIncreaseBudgetDto extends PartialType(
  CreateIncreaseBudgetDto,
) {}
