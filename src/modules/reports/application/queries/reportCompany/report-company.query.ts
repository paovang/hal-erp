import { EntityManager } from 'typeorm';

export class GetReportCompanyQuery {
  constructor(public manager: EntityManager) {
    // console.log('hello world');
  }
}
