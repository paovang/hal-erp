import {
  EligiblePersons,
  EnumPrOrPo,
} from '@src/modules/manage/application/constants/status-key.const';
import { EntityManager } from 'typeorm';
import { PurchaseOrderOrmEntity } from '../infrastructure/database/typeorm/purchase-order.orm';
import { PurchaseRequestOrmEntity } from '../infrastructure/database/typeorm/purchase-request.orm';
import { ReceiptOrmEntity } from '../infrastructure/database/typeorm/receipt.orm';

export async function countStatusAmounts(
  manager: EntityManager,
  type?: EnumPrOrPo,
  user_id?: number,
  roles?: string[],
  departmentId?: number,
  status_id?: number,
  start_date?: string,
  end_date?: string,
): Promise<{ id: number; status: string; amount: number }[]> {
  // เงื่อนไข type
  if (type === EnumPrOrPo.PO) {
    const query = manager
      .createQueryBuilder(PurchaseOrderOrmEntity, 'po')
      .innerJoin('po.documents', 'doc')
      .innerJoin('doc.user_approvals', 'ua')
      .innerJoin('ua.document_statuses', 'ds')
      .innerJoin('ua.user_approval_steps', 'uas')
      .innerJoin(
        'uas.document_approvers',
        'document_approver',
        'document_approver.user_approval_step_id = uas.id',
      )
      // เลือกเฉพาะฟิลด์ที่ต้องการเพื่อให้ GROUP BY ถูกต้อง
      .select('ua.status_id', 'id')
      .addSelect('ds.name', 'status')
      // ถ้าต้องการนับจำนวน PO ให้ใช้ COUNT(DISTINCT po.id)
      // ถ้าต้องการนับจำนวน document ให้ใช้ COUNT(DISTINCT doc.id)
      .addSelect('COUNT(DISTINCT doc.id)', 'amount');

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      query.andWhere('document_approver.user_id = :user_id', {
        user_id,
      });
    }

    // Group โดยเฉพาะฟิลด์ที่เลือก (status id และ name)
    query.groupBy('ua.status_id').addGroupBy('ds.name');

    const result = await query.getRawMany();

    return result.map((row) => ({
      id: Number(row.id),
      status: row.status,
      amount: Number(row.amount),
    }));
  } else if (type === EnumPrOrPo.PR) {
    const query = manager
      .createQueryBuilder(PurchaseRequestOrmEntity, 'pr')
      .innerJoin('pr.documents', 'doc')
      .innerJoin('doc.user_approvals', 'ua')
      .innerJoin('ua.document_statuses', 'ds')
      .innerJoin('ua.user_approval_steps', 'uas')
      .innerJoin(
        'uas.document_approvers',
        'document_approver',
        'document_approver.user_approval_step_id = uas.id',
      )
      // เลือกเฉพาะฟิลด์ที่ต้องการเพื่อให้ GROUP BY ถูกต้อง
      .select('ua.status_id', 'id')
      .addSelect('ds.name', 'status')
      // ถ้าต้องการนับจำนวน PO ให้ใช้ COUNT(DISTINCT po.id)
      // ถ้าต้องการนับจำนวน document ให้ใช้ COUNT(DISTINCT doc.id)
      .addSelect('COUNT(DISTINCT doc.id)', 'amount');

    if (start_date && end_date) {
      query.andWhere(`pr.expected_date BETWEEN :dateStart AND :dateEnd`, {
        dateStart: `${start_date} 00:00:00`,
        dateEnd: `${end_date} 23:59:59`,
      });
    }

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      query.andWhere('document_approver.user_id = :user_id', {
        user_id,
      });
    }

    if (departmentId) {
      query.andWhere('documents.department_id = :departmentId', {
        departmentId,
      });
    }

    if (status_id) {
      query.andWhere('ua.status_id = :status_id', { status_id });
    }

    if (start_date && end_date) {
      query.andWhere(`pr.requested_date BETWEEN :dateStart AND :dateEnd`, {
        dateStart: `${start_date} 00:00:00`,
        dateEnd: `${end_date} 23:59:59`,
      });
    }

    // Group โดยเฉพาะฟิลด์ที่เลือก (status id และ name)
    query.groupBy('ua.status_id').addGroupBy('ds.name');

    const result = await query.getRawMany();

    return result.map((row) => ({
      id: Number(row.id),
      status: row.status,
      amount: Number(row.amount),
    }));
  } else if (type === EnumPrOrPo.R) {
    const query = manager
      .createQueryBuilder(ReceiptOrmEntity, 'r')
      .innerJoin('r.documents', 'doc')
      .innerJoin('doc.user_approvals', 'ua')
      .innerJoin('ua.document_statuses', 'ds')
      .innerJoin('ua.user_approval_steps', 'uas')
      .innerJoin(
        'uas.document_approvers',
        'document_approver',
        'document_approver.user_approval_step_id = uas.id',
      )
      // เลือกเฉพาะฟิลด์ที่ต้องการเพื่อให้ GROUP BY ถูกต้อง
      .select('ua.status_id', 'id')
      .addSelect('ds.name', 'status')
      // ถ้าต้องการนับจำนวน PO ให้ใช้ COUNT(DISTINCT po.id)
      // ถ้าต้องการนับจำนวน document ให้ใช้ COUNT(DISTINCT doc.id)
      .addSelect('COUNT(DISTINCT doc.id)', 'amount');

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      query.andWhere('document_approver.user_id = :user_id', {
        user_id,
      });
    }

    // Group โดยเฉพาะฟิลด์ที่เลือก (status id และ name)
    query.groupBy('ua.status_id').addGroupBy('ds.name');

    const result = await query.getRawMany();

    return result.map((row) => ({
      id: Number(row.id),
      status: row.status,
      amount: Number(row.amount),
    }));
  } else {
    return [];
  }

  // query.groupBy('ua.status_id').addGroupBy('ds.name');

  // const result = await query.getRawMany();

  // return result.map((row) => ({
  //   id: Number(row.id),
  //   status: row.status,
  //   amount: Number(row.amount),
  // }));
}

export default countStatusAmounts;
