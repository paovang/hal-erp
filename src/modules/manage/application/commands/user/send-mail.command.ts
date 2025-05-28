import { EntityManager } from 'typeorm';
import { SendMailDto } from '../../dto/create/user/send-email.dto';

export class SendMailCommand {
  constructor(
    public readonly dto: SendMailDto,
    public readonly manager: EntityManager,
  ) {}
}
