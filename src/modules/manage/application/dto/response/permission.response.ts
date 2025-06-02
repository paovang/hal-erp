import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  display_name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class PermissionGroupResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  display_name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  permissions: PermissionResponse[];
}
