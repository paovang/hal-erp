import { EntityManager } from 'typeorm';
import { ForgotPasswordDto } from '../../dto/create/user/forgot-password.dto';

export class ForgotPasswordCommand {
  constructor(
    public readonly dto: ForgotPasswordDto,
    public readonly manager: EntityManager,
  ) {}
}
