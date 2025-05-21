import { OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "./create.dto";

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {}