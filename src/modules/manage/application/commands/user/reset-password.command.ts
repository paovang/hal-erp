import { EntityManager } from 'typeorm';
import { ResetPasswordDto } from '../../dto/create/user/reset-password.dto';

export class ResetPasswordCommand {
  constructor(
    public readonly dto: ResetPasswordDto,
    public readonly manager: EntityManager,
  ) {}
}
