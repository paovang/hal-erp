import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_BUDGET_APPROVAL_RULE_REPOSITORY } from '../../../constants/inject-key.const';
import { BudgetApprovalRuleEntity } from '@src/modules/manage/domain/entities/budget-approval-rule.entity';
import { IWriteBudgetApprovalRuleRepository } from '@src/modules/manage/domain/ports/output/budget-approval-rule.interface';
import { BudgetApprovalRuleDataMapper } from '../../../mappers/budget-approval-rule.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements
    IQueryHandler<CreateCommand, ResponseResult<BudgetApprovalRuleEntity>>
{
  constructor(
    @Inject(WRITE_BUDGET_APPROVAL_RULE_REPOSITORY)
    private readonly _write: IWriteBudgetApprovalRuleRepository,
    private readonly _dataMapper: BudgetApprovalRuleDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const { min_amount, max_amount } = query.dto;
        let departmentId: number | null | undefined = null;
        const user = this._userContextService.getAuthUser()?.user;
        const user_id = user?.id;

        let company_id: number | null | undefined = null;
        const company = await query.manager.findOne(CompanyUserOrmEntity, {
          where: {
            user_id: user_id,
          },
        });

        const departmentUser = await query.manager.findOne(
          DepartmentUserOrmEntity,
          {
            where: { user_id: user_id },
          },
        );
        const department_id = departmentUser?.department_id ?? null;

        if (query.dto.department_id) {
          await findOneOrFail(query.manager, DepartmentOrmEntity, {
            id: query.dto.department_id,
          });
        }

        if (department_id && department_id !== null) {
          departmentId = department_id;
        } else if (query.dto.department_id) {
          departmentId = query.dto.department_id;
        } else {
          departmentId = undefined;
        }

        company_id = company?.company_id ?? null;

        if (company_id) {
          const check_budget_approval_rule = await query.manager.findOne(
            BudgetApprovalRuleOrmEntity,
            {
              where: {
                approver_id: query.dto.approver_id,
                company_id: company_id,
              },
            },
          );

          if (check_budget_approval_rule) {
            throw new ManageDomainException(
              'errors.already_exists',
              HttpStatus.BAD_REQUEST,
              { property: `approver id ${query.dto.approver_id}` },
            );
          }
        } else {
          await _checkColumnDuplicate(
            BudgetApprovalRuleOrmEntity,
            'approver_id',
            query.dto.approver_id,
            query.manager,
            'errors.already_exists',
          );
        }

        if (min_amount >= max_amount) {
          throw new ManageDomainException(
            'errors.min_amount_greater_than_max_amount',
            HttpStatus.BAD_REQUEST,
          );
        }

        await findOneOrFail(manager, DepartmentUserOrmEntity, {
          user_id: query.dto.approver_id,
        });

        const mapToEntity = this._dataMapper.toEntity(
          query.dto,
          departmentId || undefined,
          company_id || undefined,
        );

        return await this._write.create(mapToEntity, manager);
      },
    );
  }
}
