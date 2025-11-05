import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowEntity } from '@src/modules/manage/domain/entities/approval-workflow.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_APPROVAL_WORKFLOW_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { ApprovalWorkflowDataMapper } from '../../../mappers/approval-workflow.mapper';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { ApprovalWorkflowId } from '@src/modules/manage/domain/value-objects/approval-workflow-id.vo';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { IsNull, Not } from 'typeorm';
import { EligiblePersons } from '../../../constants/status-key.const';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements
    IQueryHandler<UpdateCommand, ResponseResult<ApprovalWorkflowEntity>>
{
  constructor(
    @Inject(WRITE_APPROVAL_WORKFLOW_REPOSITORY)
    private readonly _write: IWriteApprovalWorkflowRepository,
    private readonly _dataMapper: ApprovalWorkflowDataMapper,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: UpdateCommand): Promise<any> {
    let company_id: number | null | undefined = null;
    await this.checkData(query);
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
            company_id: Not(company_id),
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

    const entity = this._dataMapper.toEntity(
      query.dto,
      company_id || undefined,
    );
    await entity.initializeUpdateSetId(new ApprovalWorkflowId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department Id */
    await findOneOrFail(query.manager, ApprovalWorkflowOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
  }

  private async checkData(query: UpdateCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
      id: query.dto.documentTypeId,
    });
  }
}
