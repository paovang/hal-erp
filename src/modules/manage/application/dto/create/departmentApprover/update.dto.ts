import { PartialType } from '@nestjs/swagger';
import {
  CreateDepartmentApproverByUserDto,
  CreateDepartmentApproverDto,
} from './create.dto';

export class UpdateDepartmentApproverDto extends PartialType(
  CreateDepartmentApproverDto,
) {}
export class UpdateDepartmentApproverDtoByUser extends PartialType(
  CreateDepartmentApproverByUserDto,
) {}
