import { EntityManager } from 'typeorm';
import { ChangePasswordDto } from '../../dto/create/user/change-password.dto';

export class ChangePasswordCommand {
  constructor(
    public readonly id: number,
    public readonly dto: ChangePasswordDto,
    public readonly manager: EntityManager,
  ) {}
}
