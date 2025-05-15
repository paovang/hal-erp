import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from '@src/modules/manage/application/dto/create/department/create.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
