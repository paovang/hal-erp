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
        name: 'department',
        display_name: 'Department',
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'unit',
        display_name: 'Unit',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'position',
        display_name: 'Position',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'role',
        display_name: 'Role',
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'user',
        display_name: 'User',
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'permission',
        display_name: 'Permission',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'document-type',
        display_name: 'Document Type',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'department-user',
        display_name: 'Department User',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'department-approver',
        display_name: 'Department Approver',
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'currency',
        display_name: 'Currency',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'document-type',
        display_name: 'Document Type',
        type: 'admin',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'vendor',
        display_name: 'Vendor',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'vendor-bank-account',
        display_name: 'Vendor Bank Account',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'budget-account',
        display_name: 'Budget Account',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'budget-item',
        display_name: 'Budget Item',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'budget-item-detail',
        display_name: 'Budget Item Detail',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'budget-approval-rule',
        display_name: 'Budget Approval Rule',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'approval-workflow',
        display_name: 'Approval Workflow',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'approval-workflow-step',
        display_name: 'Approval Workflow Step',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'document',
        display_name: 'Document',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'purchase-request',
        display_name: 'Purchase Request',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'purchase-request-item',
        display_name: 'Purchase Request Item',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'purchase-order',
        display_name: 'Purchase Order',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'purchase-order-item',
        display_name: 'Purchase Order Item',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'purchase-order-selected-vendor',
        display_name: 'Purchase Order Selected Vendor',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'purchase-order-item-quote',
        display_name: 'Purchase Order Item Quote',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'user-approval',
        display_name: 'User Approval',
        type: 'all',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'user-approval-step',
        display_name: 'User Approval Step',
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
        const items = _respository.create(item);
        await _respository.save(items);
      }
    }
    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepository);
  }
}
