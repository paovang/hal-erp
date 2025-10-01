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
): Promise<{ id: number; status: string; amount: number }[]> {
  // เงื่อนไข type
  if (type === EnumPrOrPo.PO) {
    // const query = manager
    //   .createQueryBuilder('user_approvals', 'ua')
    //   // .leftJoin('document')
    //   .select('ua.status_id', 'id')
    //   .addSelect('ds.name', 'status')
    //   .addSelect('COUNT(*)', 'amount')
    //   .innerJoin('ua.document_statuses', 'ds')
    //   .innerJoin('ua.user_approval_steps', 'uas')
    //   .innerJoin('ua.documents', 'doc')
    //   // .leftJoin('doc.purchase_orders', 'po')
    //   // .leftJoin('doc.departments', 'departments')
    // .innerJoin(
    //   'uas.document_approvers',
    //   'document_approver',
    //   'document_approver.user_approval_step_id = uas.id',
    // );
    // // Join เฉพาะ PO
    // query.innerJoin('purchase_orders', 'po', 'doc.id = po.document_id');
    // if (
    //   roles &&
    //   !roles.includes(EligiblePersons.SUPER_ADMIN) &&
    //   !roles.includes(EligiblePersons.ADMIN)
    // ) {
    //   query.andWhere('document_approver.user_id = :user_id', {
    //     user_id,
    //   });
    // }

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
    // const query = manager
    //   .createQueryBuilder('user_approvals', 'ua')
    //   .select('ua.status_id', 'id')
    //   .addSelect('ds.name', 'status')
    //   .addSelect('COUNT(*)', 'amount')
    //   .innerJoin('ua.document_statuses', 'ds')
    //   .innerJoin('ua.user_approval_steps', 'uas')
    //   .innerJoin('ua.documents', 'doc')
    //   // .leftJoin('doc.departments', 'departments')
    //   .innerJoin(
    //     'uas.document_approvers',
    //     'document_approver',
    //     'document_approver.user_approval_step_id = uas.id',
    //   );
    // // Join เฉพาะ PR
    // query.innerJoin('purchase_requests', 'pr', 'doc.id = pr.document_id');
    // if (
    //   roles &&
    //   !roles.includes(EligiblePersons.SUPER_ADMIN) &&
    //   !roles.includes(EligiblePersons.ADMIN)
    // ) {
    //   query.andWhere('document_approver.user_id = :user_id', {
    //     user_id,
    //   });
    // }
    // query.groupBy('ua.status_id').addGroupBy('ds.name');

    // const result = await query.getRawMany();

    // return result.map((row) => ({
    //   id: Number(row.id),
    //   status: row.status,
    //   amount: Number(row.amount),
    // }));

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
  } else if (type === EnumPrOrPo.R) {
    // const query = manager
    //   .createQueryBuilder('user_approvals', 'ua')
    //   .select('ua.status_id', 'id')
    //   .addSelect('ds.name', 'status')
    //   .addSelect('COUNT(*)', 'amount')
    //   .innerJoin('ua.document_statuses', 'ds')
    //   .innerJoin('ua.user_approval_steps', 'uas')
    //   .innerJoin('ua.documents', 'doc')
    //   // .leftJoin('doc.departments', 'departments')
    //   .innerJoin(
    //     'uas.document_approvers',
    //     'document_approver',
    //     'document_approver.user_approval_step_id = uas.id',
    //   );
    // // Join เฉพาะ R
    // query.innerJoin('receipts', 'r', 'doc.id = r.document_id');
    // if (
    //   roles &&
    //   !roles.includes(EligiblePersons.SUPER_ADMIN) &&
    //   !roles.includes(EligiblePersons.ADMIN)
    // ) {
    //   query.andWhere('document_approver.user_id = :user_id', {
    //     user_id,
    //   });
    // }

    // query.groupBy('ua.status_id').addGroupBy('ds.name');

    // const result = await query.getRawMany();

    // return result.map((row) => ({
    //   id: Number(row.id),
    //   status: row.status,
    //   amount: Number(row.amount),
    // }));

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
