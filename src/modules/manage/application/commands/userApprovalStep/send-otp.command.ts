import { EntityManager } from 'typeorm';

export class SendOTPCommand {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
