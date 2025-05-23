import { PartialType } from "@nestjs/swagger";
import { CreatePositionDto } from "./create.dto";

export class UpdatePositionDto extends PartialType(CreatePositionDto) {}