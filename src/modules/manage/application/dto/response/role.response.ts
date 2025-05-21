import { ApiProperty } from "@nestjs/swagger";

export class RoleResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  guard_name: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}