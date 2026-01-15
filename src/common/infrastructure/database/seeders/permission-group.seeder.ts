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
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 2,
        name: 'unit',
        display_name: 'Unit',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 3,
        name: 'position',
        display_name: 'Position',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 4,
        name: 'role',
        display_name: 'Role',
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 5,
        name: 'user',
        display_name: 'User',
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 6,
        name: 'permission',
        display_name: 'Permission',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 7,
        name: 'document-type',
        display_name: 'Document Type',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 8,
        name: 'department-user',
        display_name: 'Department User',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 9,
        name: 'department-approver',
        display_name: 'Department Approver',
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 10,
        name: 'currency',
        display_name: 'Currency',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 11,
        name: 'vendor',
        display_name: 'Vendor',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 12,
        name: 'vendor-bank-account',
        display_name: 'Vendor Bank Account',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 13,
        name: 'budget-account',
        display_name: 'Budget Account',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 14,
        name: 'budget-item',
        display_name: 'Budget Item',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 15,
        name: 'budget-item-detail',
        display_name: 'Budget Item Detail',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 16,
        name: 'budget-approval-rule',
        display_name: 'Budget Approval Rule',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 17,
        name: 'approval-workflow',
        display_name: 'Approval Workflow',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 18,
        name: 'approval-workflow-step',
        display_name: 'Approval Workflow Step',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 19,
        name: 'document',
        display_name: 'Document',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 20,
        name: 'purchase-request',
        display_name: 'Purchase Request',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 21,
        name: 'purchase-request-item',
        display_name: 'Purchase Request Item',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 22,
        name: 'purchase-order',
        display_name: 'Purchase Order',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 23,
        name: 'purchase-order-item',
        display_name: 'Purchase Order Item',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 24,
        name: 'purchase-order-selected-vendor',
        display_name: 'Purchase Order Selected Vendor',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 25,
        name: 'user-approval',
        display_name: 'User Approval',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 26,
        name: 'user-approval-step',
        display_name: 'User Approval Step',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 27,
        name: 'receipt',
        display_name: 'Receipt',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 28,
        name: 'receipt-item',
        display_name: 'Receipt Item',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 29,
        name: 'company',
        display_name: 'Company',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 30,
        name: 'company-user',
        display_name: 'Company User',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 31,
        name: 'category',
        display_name: 'Category',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 32,
        name: 'increase-budget',
        display_name: 'Increase Budget',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 33,
        name: 'increase-budget-detail',
        display_name: 'Increase Budget Detail',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 34,
        name: 'product-type',
        display_name: 'Product Type',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 35,
        name: 'product',
        display_name: 'Product',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 36,
        name: 'quota-company',
        display_name: 'Quota Company',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 37,
        name: 'vendor-product',
        display_name: 'Vendor Product',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 38,
        name: 'vat',
        display_name: 'Vat',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 39,
        name: 'bank',
        display_name: 'Bank',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 40,
        name: 'budget-approval',
        display_name: 'Budget Approval',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 41,
        name: 'department-rule',
        display_name: 'Department Rule',
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
          `INSERT INTO "permission_groups" ("id", "name", "display_name", "type", "created_at", "updated_at")
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT ("id") DO NOTHING`,
          [
            item.id,
            item.name,
            item.display_name,
            item.type,
            item.created_at,
            item.updated_at,
          ],
        );
      }
    }
    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepository);
  }
}
