import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowEntity } from '@src/modules/manage/domain/entities/approval-workflow.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_APPROVAL_WORKFLOW_REPOSITORY,
  WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { ApprovalWorkflowDataMapper } from '../../../mappers/approval-workflow.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, IsNull } from 'typeorm';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';
import { IWriteApprovalWorkflowStepRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-step-repository.interface';
import { ApprovalWorkflowStepDataMapper } from '../../../mappers/approval-workflow-step.mapper';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import {
  EligiblePersons,
  EnumWorkflowStep,
} from '../../../constants/status-key.const';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements
    IQueryHandler<CreateCommand, ResponseResult<ApprovalWorkflowEntity>>
{
  constructor(
    @Inject(WRITE_APPROVAL_WORKFLOW_REPOSITORY)
    private readonly _write: IWriteApprovalWorkflowRepository,
    private readonly _dataMapper: ApprovalWorkflowDataMapper,
    @Inject(WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY)
    private readonly _writeStep: IWriteApprovalWorkflowStepRepository,
    private readonly _dataMapperStep: ApprovalWorkflowStepDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    const seen = new Set<number>();
    const duplicates = new Set<number>();

    await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
      id: query.dto.documentTypeId,
    });

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        let mergeData: any = null;
        let company_id: number | null | undefined = null;
        const user = this._userContextService.getAuthUser()?.user;
        const user_id = user.id;

        const roles = user?.roles?.map((r: any) => r.name) ?? [];

        if (
          roles.includes(EligiblePersons.SUPER_ADMIN) ||
          roles.includes(EligiblePersons.ADMIN)
        ) {
          const documentType = await query.manager.findOne(
            ApprovalWorkflowOrmEntity,
            {
              where: {
                document_type_id: query.dto.documentTypeId,
                company_id: IsNull(),
              },
            },
          );

          if (documentType) {
            throw new ManageDomainException(
              'errors.document_type_already_exists',
              HttpStatus.BAD_REQUEST,
              { property: 'documentTypeId' },
            );
          }
        } else {
          const company_user = await findOneOrFail(
            query.manager,
            CompanyUserOrmEntity,
            {
              user_id: user_id,
            },
            `company user id ${user_id}`,
          );

          company_id = company_user.company_id;
          if (!company_id)
            throw new ManageDomainException(
              'errors.not_found',
              HttpStatus.NOT_FOUND,
              { property: 'company_id' },
            );

          const documentType = await query.manager.findOne(
            ApprovalWorkflowOrmEntity,
            {
              where: {
                document_type_id: query.dto.documentTypeId,
                company_id: company_id,
              },
            },
          );

          if (documentType) {
            throw new ManageDomainException(
              'errors.document_type_already_exists',
              HttpStatus.BAD_REQUEST,
              { property: 'documentTypeId' },
            );
          }
        }

        const mapToEntity = this._dataMapper.toEntity(
          query.dto,
          company_id || undefined,
        );

        const result = await this._write.create(mapToEntity, manager);
        const workflow_id = (result as any)._id._value;

        // ✅ Validate step_number inputs
        await this.checkWorkflow(query);

        // ✅ Get current max step_number in DB for this workflow
        await this.checkStep(manager, workflow_id, query);

        for (const step of query.dto.steps) {
          if (seen.has(step.step_number)) {
            duplicates.add(step.step_number);
          } else {
            seen.add(step.step_number);
          }

          if (step.type === EnumWorkflowStep.DEPARTMENT) {
            if (!step.departmentId) {
              throw new ManageDomainException(
                'errors.is_required',
                HttpStatus.BAD_REQUEST,
                { property: 'departmentId' },
              );
            }
            await findOneOrFail(manager, DepartmentOrmEntity, {
              id: step.departmentId,
            });

            mergeData = {
              ...step,
              department_id: step.departmentId,
              userId: null,
            };
          } else if (step.type === EnumWorkflowStep.SPECIFIC_USER) {
            if (!step.userId) {
              throw new ManageDomainException(
                'errors.is_required',
                HttpStatus.BAD_REQUEST,
                { property: 'userId' },
              );
            }
            await findOneOrFail(manager, UserOrmEntity, {
              id: step.userId,
            });

            mergeData = {
              ...step,
              department_id: null,
              userId: step.userId,
            };
          } else {
            mergeData = {
              ...step,
              department_id: null,
              userId: null,
            };
          }
          const stepEntity = this._dataMapperStep.toEntity(
            mergeData,
            workflow_id,
          );
          await this._writeStep.create(stepEntity, manager);
        }

        if (duplicates.size > 0) {
          throw new ManageDomainException(
            'errors.duplicate_step_number',
            HttpStatus.BAD_REQUEST,
          );
        }

        return result;
      },
    );
  }

  private async checkWorkflow(query: CreateCommand): Promise<void> {
    // ✅ Validate step_number inputs
    const inputStepNumbers = query.dto.steps.map((step) => step.step_number);
    const sortedStepNumbers = [...new Set(inputStepNumbers)].sort(
      (a, b) => a - b,
    );

    const minStep = sortedStepNumbers[0];
    const maxStep = sortedStepNumbers[sortedStepNumbers.length - 1];

    // Check for missing step numbers (non-consecutive)
    const expectedSequence = Array.from(
      { length: maxStep - minStep + 1 },
      (_, i) => minStep + i,
    );
    const missingSteps = expectedSequence.filter(
      (num) => !sortedStepNumbers.includes(num),
    );

    if (missingSteps.length > 0) {
      throw new ManageDomainException(
        'errors.missing_step_number',
        HttpStatus.BAD_REQUEST,
        {
          property: 'step_number',
        },
      );
    }
  }

  private async checkStep(
    manager: EntityManager,
    workflow_id: number,
    query: CreateCommand,
  ): Promise<void> {
    // ✅ Get current max step_number in DB for this workflow
    const existingMaxStepNumber = await manager
      .getRepository(ApprovalWorkflowStepOrmEntity)
      .createQueryBuilder('step')
      .select('MAX(step.step_number)', 'max')
      .where('step.approval_workflow_id = :workflowId', {
        workflowId: workflow_id,
      })
      .getRawOne();

    const maxStepNumber = existingMaxStepNumber?.max
      ? Number(existingMaxStepNumber.max)
      : 0;

    // ✅ Ensure new step(s) start with max + 1
    const incomingMinStepNumber = Math.min(
      ...query.dto.steps.map((s) => s.step_number),
    );
    if (incomingMinStepNumber !== maxStepNumber + 1) {
      throw new ManageDomainException(
        'errors.invalid_step_number',
        HttpStatus.BAD_REQUEST,
        {
          property: `${maxStepNumber + 1}`,
        },
      );
    }
  }
}
