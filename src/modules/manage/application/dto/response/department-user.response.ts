import { ApiProperty } from "@nestjs/swagger";

export class userResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  tel: string;

  @ApiProperty()
  department_id: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class DepartmentUserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  // @ApiProperty()
  // user: userResponse[];
}