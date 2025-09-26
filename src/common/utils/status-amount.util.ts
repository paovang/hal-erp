import {
  EligiblePersons,
  EnumPrOrPo,
} from '@src/modules/manage/application/constants/status-key.const';
import { EntityManager } from 'typeorm';

export async function countStatusAmounts(
  manager: EntityManager,
  type?: EnumPrOrPo,
  user_id?: number,
  roles?: string[],
): Promise<{ id: number; status: string; amount: number }[]> {
  const query = manager
    .createQueryBuilder('user_approvals', 'ua')
    .select('ua.status_id', 'id')
    .addSelect('ds.name', 'status')
    .addSelect('COUNT(*)', 'amount')
    .innerJoin('ua.document_statuses', 'ds')
    .innerJoin('ua.user_approval_steps', 'uas')
    .innerJoin('ua.documents', 'doc')
    // .leftJoin('doc.departments', 'departments')
    .innerJoin(
      'uas.document_approvers',
      'document_approver',
      'document_approver.user_approval_step_id = uas.id',
    );

  // เงื่อนไข type
  if (type === EnumPrOrPo.PO) {
    // Join เฉพาะ PO
    query.innerJoin('purchase_orders', 'po', 'doc.id = po.document_id');
    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      query.andWhere('document_approver.user_id = :user_id', {
        user_id,
      });
    }
  } else if (type === EnumPrOrPo.PR) {
    // Join เฉพาะ PR
    query.innerJoin('purchase_requests', 'pr', 'doc.id = pr.document_id');
    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      query.andWhere('document_approver.user_id = :user_id', {
        user_id,
      });
    }
  } else if (type === EnumPrOrPo.R) {
    // Join เฉพาะ R
    query.innerJoin('receipts', 'r', 'doc.id = r.document_id');
    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      query.andWhere('document_approver.user_id = :user_id', {
        user_id,
      });
    }
  } else {
    return [];
  }

  query.groupBy('ua.status_id').addGroupBy('ds.name');

  const result = await query.getRawMany();

  return result.map((row) => ({
    id: Number(row.id),
    status: row.status,
    amount: Number(row.amount),
  }));
}

export default countStatusAmounts;
