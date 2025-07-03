import { EntityManager } from 'typeorm';

export class LoginCommand {
  constructor(
    public readonly dto: any,
    public readonly manager: EntityManager,
  ) {}
}
