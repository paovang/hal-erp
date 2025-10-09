import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponse } from './department.response';
import { UserResponse } from './user.response';
import { DocumentTypeResponse } from './document-type.response';
import { PositionResponse } from './position.response';

export class DocumentResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  document_number: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  total_amount: number;

  @ApiProperty()
  department_id: number;

  @ApiProperty()
  requester_id: number;

  @ApiProperty()
  document_type_id: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  department: DepartmentResponse | null;

  @ApiProperty()
  document_type: DocumentTypeResponse | null;

  @ApiProperty()
  requester: UserResponse | null;

  @ApiProperty()
  position: PositionResponse[] | null;
}
