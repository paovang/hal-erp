import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { IReportCompanuRepository } from '@src/modules/reports/domain/ports/output/company-repository.interface';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReportReadCompanyRepository implements IReportCompanuRepository {
  constructor(
    @InjectRepository(CompanyOrmEntity)
    private readonly _companyOrm: Repository<CompanyOrmEntity>,
    // private readonly _dataAccessMapper: ReportReceiptDataAccessMapper,
    // @Inject(PAGINATION_SERVICE)
    // private readonly _paginationService: IPaginationService,
  ) {}
  async reportCompany(manager: EntityManager): Promise<any> {
    // const items = await this._companyOrm.find({
    //   relations: ['company_users'],
    // });

    const items = await manager
      .createQueryBuilder(CompanyOrmEntity, 'company')
      .leftJoinAndSelect('company.company_users', 'company_users')
      .leftJoinAndSelect('company_users.user', 'user')
      .leftJoinAndSelect('company.approval_workflows', 'approval_workflows')
      .leftJoinAndSelect(
        'company.budget_approval_rules',
        'budget_approval_rules',
      )
      .leftJoinAndSelect('company.budget_accounts', 'budget_accounts')
      .loadRelationCountAndMap(
        'company.approvalWorkflowCount',
        'company.approval_workflows',
      )
      .loadRelationCountAndMap(
        'company.budgetRuleCount',
        'company.budget_approval_rules',
      )
      .loadRelationCountAndMap('company.userCount', 'company.company_users')
      .getMany();
    return items;
  }
}
