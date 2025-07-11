import { EnumPrOrPo } from '@src/modules/manage/application/constants/status-key.const';
import { EntityManager } from 'typeorm';

export async function countStatusAmounts(
  manager: EntityManager,
  departmentId?: number,
  type?: EnumPrOrPo,
): Promise<{ id: number; status: string; amount: number }[]> {
  const query = manager
    .createQueryBuilder('user_approvals', 'ua')
    .select('ua.status_id', 'id')
    .addSelect('ds.name', 'status')
    .addSelect('COUNT(*)', 'amount')
    .innerJoin('ua.document_statuses', 'ds')
    .innerJoin('ua.user_approval_steps', 'uas')
    .innerJoin('ua.documents', 'doc')
    .leftJoin('doc.departments', 'departments')
    .leftJoin('uas.approval_workflow_steps', 'approval_workflow_steps');

  // เงื่อนไข department เหมือนเดิม
  if (departmentId !== undefined && departmentId !== null) {
    query
      .andWhere('approval_workflow_steps.department_id = :departmentId', {
        departmentId,
      })
      .andWhere('doc.department_id = :departmentId', { departmentId });
  }

  // เงื่อนไข type
  if (type === EnumPrOrPo.PO) {
    // Join เฉพาะ PO
    query.innerJoin('purchase_orders', 'po', 'doc.id = po.document_id');
  } else if (type === EnumPrOrPo.PR) {
    // Join เฉพาะ PR
    query.innerJoin('purchase_requests', 'pr', 'doc.id = pr.document_id');
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
