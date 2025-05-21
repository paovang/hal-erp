import { PartialType } from "@nestjs/swagger";
import { CreateUnitDto } from "./create.dto";

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}
