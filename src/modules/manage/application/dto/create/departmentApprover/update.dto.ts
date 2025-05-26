import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentApproverDto } from './create.dto';

export class UpdateDepartmentApproverDto extends PartialType(
  CreateDepartmentApproverDto,
) {}
