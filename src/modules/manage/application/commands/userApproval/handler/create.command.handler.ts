// import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
// import { CreateCommand } from '../create.command';
// import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
// import { UserApprovalEntity } from '@src/modules/manage/domain/entities/user-approval.entity';
// import { HttpStatus, Inject } from '@nestjs/common';
// import {
//   WRITE_USER_APPROVAL_REPOSITORY,
//   WRITE_USER_APPROVAL_STEP_REPOSITORY,
// } from '../../../constants/inject-key.const';
// import { UserApprovalDataMapper } from '../../../mappers/user-approval.mapper';
// import { IWriteUserApprovalRepository } from '@src/modules/manage/domain/ports/output/user-approval-repository.interface';
// import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
// import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
// import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
// import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
// import { UserApprovalStepDataMapper } from '../../../mappers/user-approval-step.mapper';
// import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
// import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';
// import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
// import { In } from 'typeorm';
// import { DocumentStatusOrmEntity } from '@src/common/infrastructure/database/typeorm/document-statuse.orm';
// import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
// import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
// import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';

// @CommandHandler(CreateCommand)
// export class CreateCommandHandler
//   implements IQueryHandler<CreateCommand, ResponseResult<UserApprovalEntity>>
// {
//   constructor(
// @Inject(WRITE_USER_APPROVAL_REPOSITORY)
// private readonly _write: IWriteUserApprovalRepository,
// private readonly _dataMapper: UserApprovalDataMapper,
//     // @Inject(WRITE_USER_APPROVAL_STEP_REPOSITORY)
//     // private readonly _writeStep: IWriteUserApprovalStepRepository,
//     // private readonly _dataMapperStep: UserApprovalStepDataMapper,
//     private readonly _userContextService: UserContextService,
//   ) {}

//   async execute(
//     query: CreateCommand,
//   ): Promise<ResponseResult<UserApprovalEntity>> {
//     const user = this._userContextService.getAuthUser()?.user;

//     const user_id = user?.id;

//     const departmentUser = await query.manager.findOne(
//       DepartmentUserOrmEntity,
//       {
//         where: { user_id: user_id },
//       },
//     );

//     const departmentId = departmentUser?.department_id ?? null;

//     const approvalWorkflowStep = await query.manager.findOne(
//       ApprovalWorkflowStepOrmEntity,
//       {
//         where: departmentId !== null ? { department_id: departmentId } : {},
//       },
//     );
//     console.log('object', approvalWorkflowStep);

//     await findOneOrFail(query.manager, DocumentOrmEntity, {
//       id: query.dto.documentId,
//     });

//     // user approval
//     const user_approval = await findOneOrFail(
//       query.manager,
//       UserApprovalOrmEntity,
//       {
//         document_id: query.dto.documentId,
//       },
//     );

//     const user_approval_id = (user_approval as any).id;
//     const userApprovalStep = await query.manager.findOne(
//       UserApprovalStepOrmEntity,
//       {
//         where: {
//           user_approval_id: user_approval_id,
//           approval_workflow_step_id: approvalWorkflowStep?.id,
//         },
//       },
//     );

//     const document_status = await query.manager.find(DocumentStatusOrmEntity, {
//       where: {
//         id: userApprovalStep?.status_id,
//       },
//     });

//     const userApprovalStepAll = await query.manager.find(
//       UserApprovalStepOrmEntity,
//       {
//         where: {
//           user_approval_id: user_approval_id,
//         },
//       },
//     );

//     const step = userApprovalStepAll.map((step) => {});

//     console.log('object', document_status);
//     console.log('object', userApprovalStep);
//     // end

//     // approval workflow
//     // const document_type_id = (document as any).document_type_id;
//     // const approval_workflow = await findOneOrFail(
//     //   query.manager,
//     //   ApprovalWorkflowOrmEntity,
//     //   {
//     //     document_type_id: document_type_id,
//     //   },
//     // );

//     // const approval_workflow_id = (approval_workflow as any).id;

//     // const approval_workflow_steps = await query.manager.find(
//     //   ApprovalWorkflowStepOrmEntity,
//     //   {
//     //     where: {
//     //       approval_workflow_id: approval_workflow_id,
//     //     },
//     //     order: {
//     //       step_number: 'ASC',
//     //     },
//     //   },
//     // );

//     // const approval_workflow_step_ids = approval_workflow_steps.map(
//     //   (step) => (step as any).id,
//     // );

//     // const user_approval_steps = await query.manager.find(
//     //   UserApprovalStepOrmEntity,
//     //   {
//     //     where: {
//     //       approval_workflow_step_id: In(approval_workflow_step_ids),
//     //       user_approval_id: user_approval_id,
//     //     },
//     //   },
//     // );
//     // const user_approval_status_ids = user_approval_steps.map(
//     //   (step) => (step as any).status_id,
//     // );

//     // const document_status = await query.manager.find(DocumentStatusOrmEntity, {
//     //   where: {
//     //     id: In(user_approval_status_ids),
//     //   },
//     // });

//     // console.log('user_approval_id', user_approval_id);
//     // console.log('object', approval_workflow_step_ids);
//     // console.log('user_approval_steps', user_approval_steps);
//     // console.log('document_status', document_status);

//     // end

//     // const entity = this._dataMapper.toEntity(query.dto);

//     // const result = await this._write.create(entity, query.manager);

//     return result;
//   }
// }
