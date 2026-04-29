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
import { UserDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user.mapper';
import { ApprovalRuleInterface } from '../application/interfaces/approval-rule.interface';

interface CustomDocumentApprover {
  user_approval_step_id: number;
  user_id: number;
}

/**
 * ข้อมูลที่ต้องส่งไป Approval Server หลังจาก transaction commit สำเร็จ
 */
export interface ApprovalNotificationData {
  user_approval_step_id: number;
  total: number;
  userEntity: any;
  user_id: number;
  department_name: string;
  type: EnumRequestApprovalType;
  titlesString: string;
  token: string;
  approval_rules: ApprovalRuleInterface[];
  from_mail?: string;
}

interface ApprovalStepHandlerParams {
  a_w_s: any; // ApprovalWorkflowStepOrmEntity;
  total: number;
  user_id: number;
  user_approval_step_id: number;
  manager: EntityManager;
  dataDocumentApproverMapper: DocumentApproverDataMapper;
  writeDocumentApprover: IWriteDocumentApproverRepository;
  userDataAccessMapper: UserDataAccessMapper;
  getApprover: (
    sum_total: number,
    manager: EntityManager,
    company_id?: number,
  ) => Promise<BudgetApprovalRuleOrmEntity[]>;
  model_id: number;
  department_name: string;
  titlesString: string;
  document_type: EnumRequestApprovalType;
  from_mail?: string;
}

export async function handleApprovalStep({
  a_w_s,
  total,
  user_id,
  user_approval_step_id,
  manager,
  dataDocumentApproverMapper,
  writeDocumentApprover,
  userDataAccessMapper,
  getApprover,
  model_id,
  department_name,
  titlesString,
  document_type,
  from_mail,
}: ApprovalStepHandlerParams): Promise<ApprovalNotificationData> {
  let token = '';
  const approval_rules: ApprovalRuleInterface[] = [];
  let notificationUserId = 0;
  let notificationUserEntity: any = null;

  if (!a_w_s) {
    throw new ManageDomainException('errors.not_found', HttpStatus.NOT_FOUND, {
      property: 'approval workflow step',
    });
  }

  switch (a_w_s.type) {
    case EnumWorkflowStep.DEPARTMENT: {
      // console.log('a_w_s.department_id', a_w_s.department_id);
      const department_approvers = await manager.find(
        DepartmentApproverOrmEntity,
        {
          where: { department_id: a_w_s.department_id },
          relations: ['users'],
        },
      );
      // console.log('department_approvers', department_approvers);

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

        const user = await manager.findOne(UserOrmEntity, {
          where: { id: d_approver.user_id },
        });

        if (!user) {
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
            { property: 'user' },
          );
        }

        const d_approver_entity =
          await dataDocumentApproverMapper.toEntity(d_approver);

        await writeDocumentApprover.create(d_approver_entity, manager);
        token = await hashData(
          model_id,
          user_approval_step_id,
          department_approver?.user_id ?? 0,
          user.email ?? '',
        );

        approval_rules.push({
          email: user.email ?? '',
          token: token,
        });
      }

      const user = await manager.findOne(UserOrmEntity, {
        where: { id: department_approvers[0]?.user_id },
      });

      if (!user) {
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.NOT_FOUND,
          { property: 'user' },
        );
      }

      notificationUserEntity = userDataAccessMapper.toEntity(user);
      notificationUserId = user.id;

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

      const d_approver_entity =
        await dataDocumentApproverMapper.toEntity(d_approver);

      await writeDocumentApprover.create(d_approver_entity, manager);

      const user = await manager.findOne(UserOrmEntity, {
        where: { id: department_head },
      });

      if (!user) {
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.NOT_FOUND,
          { property: 'user' },
        );
      }

      token = await hashData(
        model_id,
        user_approval_step_id,
        department?.department_head_id ?? 0,
        user.email ?? '',
      );

      approval_rules.push({
        email: user.email ?? '',
        token: token,
      });

      notificationUserEntity = userDataAccessMapper.toEntity(user);
      notificationUserId = department?.department_head_id ?? 0;

      break;
    }
    case EnumWorkflowStep.SPECIFIC_USER: {
      const specific_user = await manager.findOne(UserOrmEntity, {
        where: { id: a_w_s.user_id },
      });

      if (!specific_user) {
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.NOT_FOUND,
          { property: 'user' },
        );
      }

      const d_approver: CustomDocumentApprover = {
        user_approval_step_id,
        user_id: a_w_s.user_id ?? 0,
      };

      const d_approver_entity =
        await dataDocumentApproverMapper.toEntity(d_approver);

      await writeDocumentApprover.create(d_approver_entity, manager);

      token = await hashData(
        model_id,
        user_approval_step_id,
        a_w_s.user_id ?? 0,
        specific_user.email ?? '',
      );

      approval_rules.push({
        email: specific_user.email ?? '',
        token: token,
      });

      notificationUserEntity = userDataAccessMapper.toEntity(specific_user);
      notificationUserId = a_w_s.user_id ?? 0;

      break;
    }
    case EnumWorkflowStep.CONDITION: {
      const user_can_approve = await getApprover(total, manager);
      for (const user_approver of user_can_approve) {
        const d_approver: CustomDocumentApprover = {
          user_approval_step_id,
          user_id: user_approver?.approver_id ?? 0,
        };

        const user = await manager.findOne(UserOrmEntity, {
          where: { id: user_approver?.approver_id },
        });

        if (!user) {
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
            { property: 'user' },
          );
        }

        const d_approver_entity =
          await dataDocumentApproverMapper.toEntity(d_approver);

        await writeDocumentApprover.create(d_approver_entity, manager);
        token = await hashData(
          model_id,
          user_approval_step_id,
          a_w_s.user_id ?? 0,
          user.email ?? '',
        );

        approval_rules.push({
          email: user.email ?? '',
          token: token,
        });
      }

      const user = await manager.findOne(UserOrmEntity, {
        where: { id: user_can_approve[0].approver_id },
      });

      if (!user) {
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.NOT_FOUND,
          { property: 'user' },
        );
      }

      notificationUserEntity = userDataAccessMapper.toEntity(user);
      notificationUserId = a_w_s.user_id ?? 0;

      break;
    }
    case EnumWorkflowStep.LINE_MANAGER: {
      const user_line_manager = await manager.findOne(DepartmentUserOrmEntity, {
        where: { user_id },
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

      const d_approver_entity =
        await dataDocumentApproverMapper.toEntity(d_approver);

      await writeDocumentApprover.create(d_approver_entity, manager);

      const user = await manager.findOne(UserOrmEntity, {
        where: { id: user_id },
      });

      if (!user) {
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.NOT_FOUND,
          { property: 'user' },
        );
      }

      token = await hashData(
        model_id,
        user_approval_step_id,
        a_w_s.user_id ?? 0,
        user.email ?? '',
      );

      approval_rules.push({
        email: user.email ?? '',
        token: token,
      });

      notificationUserEntity = userDataAccessMapper.toEntity(user);
      notificationUserId = a_w_s.user_id ?? 0;

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

  // Return ข้อมูลสำหรับส่ง notification หลัง transaction commit
  return {
    user_approval_step_id,
    total,
    userEntity: notificationUserEntity,
    user_id: notificationUserId,
    department_name,
    type: document_type,
    titlesString,
    token,
    approval_rules,
    from_mail,
  };
}

/**
 * ส่ง approval request ไป external server
 * เรียกฟังก์ชันนี้หลังจาก transaction commit สำเร็จแล้วเท่านั้น
 */
export async function sendApprovalNotification(
  data: ApprovalNotificationData,
): Promise<void> {
  await sendApprovalRequest(
    data.user_approval_step_id,
    data.total,
    data.userEntity,
    data.user_id,
    data.department_name,
    data.type,
    data.titlesString,
    data.token,
    data.approval_rules,
    data.from_mail,
  );
}
