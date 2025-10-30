import { OmitType } from '@nestjs/swagger';
import { CreateCompanyDto } from '@src/modules/manage/application/dto/create/company/create.dto';

export class UpdateCompanyDto extends OmitType(CreateCompanyDto, [
  'user',
] as const) {}
