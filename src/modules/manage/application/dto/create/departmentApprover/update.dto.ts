import { PartialType } from '@nestjs/swagger';
import {
  CreateDepartmentApproverByUserDto,
  CreateDepartmentApproverDto,
} from './create.dto';

export class UpdateDepartmentApproverDto extends PartialType(
  CreateDepartmentApproverDto,
) {}
export class UpdateDepartmentApproverByUserDto extends PartialType(
  CreateDepartmentApproverByUserDto,
) {}
