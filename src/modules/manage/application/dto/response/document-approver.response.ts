import { ApiProperty } from '@nestjs/swagger';

export class DocumentApproverResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_approval_step_id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
