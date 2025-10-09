import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';

export class DocumentAttachmentResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  document_id: number;

  @ApiProperty()
  file_name: string;

  @ApiProperty()
  file_name_url: string;

  @ApiProperty()
  created_by: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  created_by_user: UserResponse | null;
}
