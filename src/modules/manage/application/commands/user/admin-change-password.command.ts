import { EntityManager } from 'typeorm';
import { AdminChangePasswordDto } from '../../dto/create/user/admin-change-password.dto';

export class AdminChangePasswordCommand {
  constructor(
    public readonly id: number,
    public readonly dto: AdminChangePasswordDto,
    public readonly manager: EntityManager,
  ) {}
}
