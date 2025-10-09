import { PartialType } from '@nestjs/swagger';
import { CreateIncreaseBudgetDetailDto } from './create.dto';

export class UpdateIncreaseBudgetDetailDto extends PartialType(
  CreateIncreaseBudgetDetailDto,
) {}
