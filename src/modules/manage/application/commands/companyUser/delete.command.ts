import { EntityManager } from 'typeorm';

export class DeleteCompanyUserCommand {
  constructor(
    public readonly id: number,
    public readonly manager: EntityManager,
  ) {}
}
