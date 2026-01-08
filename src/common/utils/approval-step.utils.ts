import { DocumentApproverDataMapper } from '@src/modules/manage/application/mappers/document-approver.mapper';
import { IWriteDocumentApproverRepository } from '@src/modules/manage/domain/ports/output/document-approver-repository.interface';
import { EntityManager } from 'typeorm';
import { BudgetApprovalRuleOrmEntity } from '../infrastructure/database/typeorm/budget-approval-rule.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { HttpStatus } from '@nestjs/common';
import {
  EnumRequestApprovalType,
  EnumWorkflowStep,
} from '@src/modules/manage/application/constants/status-key.const';
import { DepartmentApproverOrmEntity } from '../infrastructure/database/typeorm/department-approver.orm';
import { DepartmentUserOrmEntity } from '../infrastructure/database/typeorm/department-user.orm';
import { DepartmentOrmEntity } from '../infrastructure/database/typeorm/department.orm';
import { UserOrmEntity } from '../infrastructure/database/typeorm/user.orm';
import { assertOrThrow } from './assert.util';
import { hashData } from './server/hash-data.util';
import { sendApprovalRequest } from './server/send-data.uitl';

interface CustomDocumentApprover {
  user_approval_step_id: number;
  user_id: number;
}

interface ApprovalStepHandlerParams {
  a_w_s: any; // ApprovalWorkflowStepOrmEntity;
  total: number;
  user_id: number;
  user_approval_step_id: number;
  manager: EntityManager;
  dataDocumentApproverMapper: DocumentApproverDataMapper;
  writeDocumentApprover: IWriteDocumentApproverRepository;
  getApprover: (
    sum_total: number,
    manager: EntityManager,
    company_id?: number,
  ) => Promise<BudgetApprovalRuleOrmEntity[]>;
  company_id?: number;
  model_id: number;
  user: any;
  department_name: string;
  titlesString: string;
}

export async function handleApprovalStep({
  a_w_s,
  total,
  user_id,
  user_approval_step_id,
  manager,
  dataDocumentApproverMapper,
  writeDocumentApprover,
  getApprover,
  company_id,
  model_id,
  user,
  department_name,
  titlesString,
}: ApprovalStepHandlerParams) {
  if (!a_w_s) {
    throw new ManageDomainException('errors.not_found', HttpStatus.NOT_FOUND, {
      property: 'approval workflow step',
    });
  }
  const mail: string[] = [];

  switch (a_w_s.type) {
    case EnumWorkflowStep.DEPARTMENT: {
      const department_approvers = await manager.find(
        DepartmentApproverOrmEntity,
        {
          where: { department_id: a_w_s.department_id },
          relations: ['users'],
        },
      );

      if (department_approvers.length === 0) {
        throw new ManageDomainException(
          'errors.please_set_department_approver',
          HttpStatus.NOT_FOUND,
        );
      }

      for (const department_approver of department_approvers) {
        const d_approver: CustomDocumentApprover = {
          user_approval_step_id,
          user_id: department_approver?.user_id ?? 0,
        };

        // Push user email to mail array
        if (department_approver?.users?.email) {
          mail.push(department_approver.users.email);
        }

        const d_approver_entity =
          await dataDocumentApproverMapper.toEntity(d_approver);

        await writeDocumentApprover.create(d_approver_entity, manager);
      }
      // send approval request server to server
      const token = await hashData(
        model_id,
        user_approval_step_id,
        user.id,
        user.tel,
        user.email,
      );

      await sendApprovalRequest(
        user_approval_step_id,
        total,
        user,
        user_id,
        department_name,
        EnumRequestApprovalType.PR,
        titlesString,
        token,
      );
      break;
    }
    case EnumWorkflowStep.DEPARTMENT_HEAD: {
      const department_user = await manager.findOne(DepartmentUserOrmEntity, {
        where: { user_id },
      });

      assertOrThrow(
        department_user,
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        'user',
      );

      const department = await manager.findOne(DepartmentOrmEntity, {
        where: { id: department_user?.department_id },
        relations: ['users'],
      });

      assertOrThrow(
        department,
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        'department',
      );
      const department_head = department?.department_head_id;
      assertOrThrow(
        department_head,
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        'department_head',
      );

      const d_approver: CustomDocumentApprover = {
        user_approval_step_id,
        user_id: department?.department_head_id ?? 0,
      };

      // Push department head email to mail array
      if (department?.users?.email) {
        mail.push(department.users.email);
      }

      const d_approver_entity =
        await dataDocumentApproverMapper.toEntity(d_approver);

      await writeDocumentApprover.create(d_approver_entity, manager);
      break;
    }
    case EnumWorkflowStep.SPECIFIC_USER: {
      // Fetch user with email
      const specific_user = await manager.findOne(UserOrmEntity, {
        where: { id: a_w_s.user_id },
      });

      const d_approver: CustomDocumentApprover = {
        user_approval_step_id,
        user_id: a_w_s.user_id ?? 0,
      };

      // Push specific user email to mail array
      if (specific_user?.email) {
        mail.push(specific_user.email);
      }

      const d_approver_entity =
        await dataDocumentApproverMapper.toEntity(d_approver);

      await writeDocumentApprover.create(d_approver_entity, manager);
      break;
    }
    case EnumWorkflowStep.CONDITION: {
      const user_can_approve = await getApprover(total, manager);
      for (const user_approver of user_can_approve) {
        const d_approver: CustomDocumentApprover = {
          user_approval_step_id,
          user_id: user_approver?.approver_id ?? 0,
        };

        const d_approver_entity =
          await dataDocumentApproverMapper.toEntity(d_approver);

        await writeDocumentApprover.create(d_approver_entity, manager);
      }
      break;
    }
    case EnumWorkflowStep.LINE_MANAGER: {
      const user_line_manager = await manager.findOne(DepartmentUserOrmEntity, {
        where: { user_id },
        relations: ['line_manager'],
      });

      assertOrThrow(
        user_line_manager,
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        'user line manager',
      );

      if (user_line_manager?.line_manager_id === null) {
        throw new ManageDomainException(
          'errors.not_found_line_manager',
          HttpStatus.NOT_FOUND,
          { property: 'line manager' },
        );
      }

      const d_approver: CustomDocumentApprover = {
        user_approval_step_id,
        user_id: user_line_manager?.line_manager_id ?? 0,
      };

      // Push line manager email to mail array
      if (user_line_manager?.line_manager?.email) {
        mail.push(user_line_manager.line_manager.email);
      }

      const d_approver_entity =
        await dataDocumentApproverMapper.toEntity(d_approver);

      await writeDocumentApprover.create(d_approver_entity, manager);
      break;
    }
    default:
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        {
          property: 'workflow step',
        },
      );
  }

  console.log('Collected emails:', mail);
  return mail;
}
