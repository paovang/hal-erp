import { Inject, Injectable } from '@nestjs/common';
import { HelperSeeder } from './helper.seeder';
import { EntityManager } from 'typeorm';
import { SeederLogOrmEntity } from '../typeorm/seeder-log.orm';
import moment from 'moment-timezone';
import { PermissionGroupOrmEntity } from '../typeorm/permission-group.orm';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';

@Injectable()
export class PermissionGroupSeeder {
  private readonly SEEDER_NAME = 'permission_group_seeders';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepository = manager.getRepository(SeederLogOrmEntity);
    const isExecute = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepository,
    );
    if (isExecute) return [];
    const _respository = manager.getRepository(PermissionGroupOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    const items = [
      {
        id: 1,
        name: 'department',
        display_name: 'Department',
        display_name_lo: 'ພະແນກ',
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 2,
        name: 'unit',
        display_name: 'Unit',
        display_name_lo: 'ຫົວໜ່ວຍ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 3,
        name: 'position',
        display_name: 'Position',
        display_name_lo: 'ຕຳແໜ່ງ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 4,
        name: 'role',
        display_name: 'Role',
        display_name_lo: 'ບົດບາດ',
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 5,
        name: 'user',
        display_name: 'User',
        display_name_lo: 'ຜູ້ໃຊ້',
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 6,
        name: 'permission',
        display_name: 'Permission',
        display_name_lo: 'ສິດອະນຸຍາດ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 7,
        name: 'document-type',
        display_name: 'Document Type',
        display_name_lo: 'ປະເພດເອກະສານ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 8,
        name: 'department-user',
        display_name: 'Department User',
        display_name_lo: 'ຜູ້ໃຊ້ພະແນກ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 9,
        name: 'department-approver',
        display_name: 'Department Approver',
        display_name_lo: 'ຜູ້ອະນຸມັດພະແນກ',
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 10,
        name: 'currency',
        display_name: 'Currency',
        display_name_lo: 'ສະກຸນເງິນ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 11,
        name: 'vendor',
        display_name: 'Vendor',
        display_name_lo: 'ຜູ້ສະໜອງ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 12,
        name: 'vendor-bank-account',
        display_name: 'Vendor Bank Account',
        display_name_lo: 'ບັນຊີທະນາຄານຜູ້ສະໜອງ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 13,
        name: 'budget-account',
        display_name: 'Budget Account',
        display_name_lo: 'ບັນຊີງົບປະມານ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 14,
        name: 'budget-item',
        display_name: 'Budget Item',
        display_name_lo: 'ລາຍການງົບປະມານ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 15,
        name: 'budget-item-detail',
        display_name: 'Budget Item Detail',
        display_name_lo: 'ລາຍລະອຽດລາຍການງົບປະມານ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 16,
        name: 'budget-approval-rule',
        display_name: 'Budget Approval Rule',
        display_name_lo: 'ກົດລະບຽບອະນຸມັດງົບປະມານ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 17,
        name: 'approval-workflow',
        display_name: 'Approval Workflow',
        display_name_lo: 'ຂະບວນການອະນຸມັດ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 18,
        name: 'approval-workflow-step',
        display_name: 'Approval Workflow Step',
        display_name_lo: 'ຂັ້ນຕອນຂະບວນການອະນຸມັດ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 19,
        name: 'document',
        display_name: 'Document',
        display_name_lo: 'ເອກະສານ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 20,
        name: 'purchase-request',
        display_name: 'Purchase Request',
        display_name_lo: 'ຄຳຮ້ອງສັ່ງຊື້',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 21,
        name: 'purchase-request-item',
        display_name: 'Purchase Request Item',
        display_name_lo: 'ລາຍການຄຳຮ້ອງສັ່ງຊື້',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 22,
        name: 'purchase-order',
        display_name: 'Purchase Order',
        display_name_lo: 'ຄຳສັ່ງຊື້',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 23,
        name: 'purchase-order-item',
        display_name: 'Purchase Order Item',
        display_name_lo: 'ລາຍການຄຳສັ່ງຊື້',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 24,
        name: 'purchase-order-selected-vendor',
        display_name: 'Purchase Order Selected Vendor',
        display_name_lo: 'ເລືອກຜູ້ສະໜອງ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 25,
        name: 'user-approval',
        display_name: 'User Approval',
        display_name_lo: 'ການອະນຸມັດເອກະສານ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 26,
        name: 'user-approval-step',
        display_name: 'User Approval Step',
        display_name_lo: 'ຂັ້ນຕອນການອະນຸມັດເອກະສານ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 27,
        name: 'receipt',
        display_name: 'Receipt',
        display_name_lo: 'ໃບເບີກຈ່າຍ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 28,
        name: 'receipt-item',
        display_name: 'Receipt Item',
        display_name_lo: 'ລາຍການໃບເບີກຈ່າຍ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 29,
        name: 'company',
        display_name: 'Company',
        display_name_lo: 'ບໍລິສັດ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 30,
        name: 'company-user',
        display_name: 'Company User',
        display_name_lo: 'ຜູ້ໃຊ້ບໍລິສັດ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 31,
        name: 'category',
        display_name: 'Category',
        display_name_lo: 'ໝວດໝູ່',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 32,
        name: 'increase-budget',
        display_name: 'Increase Budget',
        display_name_lo: 'ຂໍເພີ່ມງົບປະມານ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 33,
        name: 'increase-budget-detail',
        display_name: 'Increase Budget Detail',
        display_name_lo: 'ລາຍລະອຽດການຂໍເພີ່ມງົບປະມານ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 34,
        name: 'product-type',
        display_name: 'Product Type',
        display_name_lo: 'ປະເພດສິນຄ້າ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 35,
        name: 'product',
        display_name: 'Product',
        display_name_lo: 'ສິນຄ້າ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 36,
        name: 'quota-company',
        display_name: 'Quota Company',
        display_name_lo: 'ໂຄຕ້າບໍລິສັດ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 37,
        name: 'vendor-product',
        display_name: 'Vendor Product',
        display_name_lo: 'ສິນຄ້າຜູ້ສະໜອງ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 38,
        name: 'vat',
        display_name: 'Vat',
        display_name_lo: 'ອາກອມ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 39,
        name: 'bank',
        display_name: 'Bank',
        display_name_lo: 'ທະນາຄານ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 40,
        name: 'budget-approval',
        display_name: 'Budget Approval',
        display_name_lo: 'ອະນຸມັດງົບປະມານ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 41,
        name: 'department-rule',
        display_name: 'Department Rule',
        display_name_lo: 'ກົດລະບຽບພະແນກ',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
    ];

    for (const item of items) {
      const existingItem = await _respository.findOne({
        where: { name: item.name },
      });

      if (!existingItem) {
        // Use raw SQL to insert with specific ID
        await manager.query(
          `INSERT INTO "permission_groups" ("id", "name", "display_name", "display_name_lo", "type", "created_at", "updated_at")
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT ("id") DO NOTHING`,
          [
            item.id,
            item.name,
            item.display_name,
            item.display_name_lo,
            item.type,
            item.created_at,
            item.updated_at,
          ],
        );
      } else if (
        !existingItem.display_name_lo ||
        existingItem.display_name_lo === null
      ) {
        // Update existing permission group if display_name_lo is missing
        await manager.query(
          `UPDATE "permission_groups"
           SET "display_name_lo" = $1, "updated_at" = $2
           WHERE "id" = $3`,
          [item.display_name_lo, new Date(), item.id],
        );
      }
    }
    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepository);
  }
}
