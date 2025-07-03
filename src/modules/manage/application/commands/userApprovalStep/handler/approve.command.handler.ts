// import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
// import { ApproveCommand } from '../approve.command';
// import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
// import { UserApprovalStepEntity } from '@src/modules/manage/domain/entities/user-approval-step.entity';
// import { HttpStatus, Inject } from '@nestjs/common';
// import { WRITE_USER_APPROVAL_STEP_REPOSITORY } from '../../../constants/inject-key.const';
// import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
// import { UserApprovalStepDataMapper } from '../../../mappers/user-approval-step.mapper';
// import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
// import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
// import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
// import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
// import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
// import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
// import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';
// import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
// import { DocumentStatusOrmEntity } from '@src/common/infrastructure/database/typeorm/document-statuse.orm';
// import { STATUS_KEY } from '../../../constants/status-key.const';
// import { validatePreviousApprovalSteps } from '@src/common/utils/approval-step.utils';
// import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';

// @CommandHandler(ApproveCommand)
// export class ApproveCommandHandler
//   implements
//     IQueryHandler<ApproveCommand, ResponseResult<UserApprovalStepEntity>>
// {
//   constructor(
//     @Inject(WRITE_USER_APPROVAL_STEP_REPOSITORY)
//     private readonly _write: IWriteUserApprovalStepRepository,
//     private readonly _dataMapper: UserApprovalStepDataMapper,
//     private readonly _userContextService: UserContextService,
//   ) {}

//   async execute(
//     query: ApproveCommand,
//   ): Promise<ResponseResult<UserApprovalStepEntity>> {
//     if (isNaN(query.id)) {
//       throw new ManageDomainException(
//         'errors.must_be_number',
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     const user = this._userContextService.getAuthUser()?.user;
//     const user_id = user?.id;

//     const departmentUser = await query.manager.findOne(
//       DepartmentUserOrmEntity,
//       {
//         where: { user_id },
//       },
//     );
//     const departmentId = departmentUser?.department_id;

//     let document_id: number;

//     if (query.dto.type === 'pr') {
//       const pr = await findOneOrFail(query.manager, PurchaseRequestOrmEntity, {
//         id: query.id,
//       });
//       document_id = (pr as any).document_id;
//     } else if (query.dto.type === 'po') {
//       const po = await findOneOrFail(query.manager, PurchaseOrderOrmEntity, {
//         id: query.id,
//       });
//       document_id = (po as any).document_id;
//     } else {
//       throw new ManageDomainException(
//         'errors.invalid_type',
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     await findOneOrFail(query.manager, DocumentStatusOrmEntity, {
//       id: query.dto.statusId,
//     });

//     // Get approval workflow step for the user's department
//     const approvalWorkflowStep = await query.manager.findOne(
//       ApprovalWorkflowStepOrmEntity,
//       {
//         where: departmentId !== null ? { department_id: departmentId } : {},
//       },
//     );

//     if (!approvalWorkflowStep) {
//       throw new ManageDomainException(
//         'errors.approval_step_not_found',
//         HttpStatus.NOT_FOUND,
//       );
//     }

//     const userApproval = await findOneOrFail(
//       query.manager,
//       UserApprovalOrmEntity,
//       {
//         document_id,
//       },
//     );

//     const [userApprovalSteps, workflowSteps] = await Promise.all([
//       query.manager.find(UserApprovalStepOrmEntity, {
//         where: { user_approval_id: (userApproval as any).id },
//       }),
//       query.manager.find(ApprovalWorkflowStepOrmEntity, {
//         where: {
//           approval_workflow_id: approvalWorkflowStep.approval_workflow_id,
//         },
//         order: { step_number: 'ASC' },
//       }),
//     ]);

//     // Check if the current user is allowed to approve
//     const currentStepEntity = validatePreviousApprovalSteps(
//       workflowSteps,
//       userApprovalSteps,
//       approvalWorkflowStep.id,
//       STATUS_KEY.APPROVED,
//       STATUS_KEY.CANCELLED,
//     );

//     const entity = this._dataMapper.toEntity(
//       query.dto,
//       user_id,
//       currentStepEntity?.id,
//     );

//     return await this._write.update(
//       entity,
//       query.manager,
//       currentStepEntity?.id,
//     );
//   }
// }
