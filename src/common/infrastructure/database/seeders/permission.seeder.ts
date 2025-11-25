import { Inject, Injectable } from '@nestjs/common';
import { HelperSeeder } from './helper.seeder';
import { EntityManager } from 'typeorm';
import { SeederLogOrmEntity } from '../typeorm/seeder-log.orm';
import { PermissionOrmEntity } from '../typeorm/permission.orm';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';

@Injectable()
export class PermissionSeeder {
  private readonly SEEDER_NAME = 'permission_seeders';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepository = manager.getRepository(SeederLogOrmEntity);
    const isExecute = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepository,
    );
    if (isExecute) return [];

    const _repository = manager.getRepository(PermissionOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    // Define your mapping here
    const permissionGroupMapping: Record<string, number> = {
      'create-department': 1,
      'read-department': 1,
      'update-department': 1,
      'delete-department': 1,

      'create-unit': 2,
      'read-unit': 2,
      'update-unit': 2,
      'delete-unit': 2,

      'create-position': 3,
      'read-position': 3,
      'update-position': 3,
      'delete-position': 3,

      'create-role': 4,
      'read-role': 4,
      'update-role': 4,
      'delete-role': 4,

      'create-user': 5,
      'read-user': 5,
      'update-user': 5,
      'delete-user': 5,

      'create-permission': 6,
      'read-permission': 6,
      'update-permission': 6,
      'delete-permission': 6,

      'create-document-type': 7,
      'read-document-type': 7,
      'update-document-type': 7,
      'delete-document-type': 7,

      'create-department-user': 8,
      'read-department-user': 8,
      'update-department-user': 8,
      'delete-department-user': 8,

      'create-department-approver': 9,
      'read-department-approver': 9,
      'update-department-approver': 9,
      'delete-department-approver': 9,

      'create-currency': 10,
      'read-currency': 10,
      'update-currency': 10,
      'delete-currency': 10,

      'create-vendor': 11,
      'read-vendor': 11,
      'update-vendor': 11,
      'delete-vendor': 11,

      'create-vendor-bank-account': 12,
      'read-vendor-bank-account': 12,
      'update-vendor-bank-account': 12,
      'delete-vendor-bank-account': 12,

      'create-budget-account': 13,
      'read-budget-account': 13,
      'update-budget-account': 13,
      'delete-budget-account': 13,

      'create-budget-item': 14,
      'read-budget-item': 14,
      'update-budget-item': 14,
      'delete-budget-item': 14,

      'create-budget-item-detail': 15,
      'read-budget-item-detail': 15,
      'update-budget-item-detail': 15,
      'delete-budget-item-detail': 15,

      'create-budget-approval-rule': 16,
      'read-budget-approval-rule': 16,
      'update-budget-approval-rule': 16,
      'delete-budget-approval-rule': 16,

      'create-approval-workflow': 17,
      'read-approval-workflow': 17,
      'update-approval-workflow': 17,
      'delete-approval-workflow': 17,

      'create-approval-workflow-step': 18,
      'read-approval-workflow-step': 18,
      'update-approval-workflow-step': 18,
      'delete-approval-workflow-step': 18,

      'create-document': 19,
      'read-document': 19,
      'update-document': 19,
      'delete-document': 19,

      'create-purchase-request': 20,
      'read-purchase-request': 20,
      'update-purchase-request': 20,
      'delete-purchase-request': 20,

      'create-purchase-request-item': 21,
      'read-purchase-request-item': 21,
      'update-purchase-request-item': 21,
      'delete-purchase-request-item': 21,

      'create-purchase-order': 22,
      'read-purchase-order': 22,
      'update-purchase-order': 22,
      'delete-purchase-order': 22,

      'create-purchase-order-item': 23,
      'read-purchase-order-item': 23,
      'update-purchase-order-item': 23,
      'delete-purchase-order-item': 23,

      'create-purchase-selected-vendor': 24,
      'read-purchase-selected-vendor': 24,
      'update-purchase-selected-vendor': 24,
      'delete-purchase-selected-vendor': 24,

      'create-user-approval': 25,
      'read-user-approval': 25,
      'update-user-approval': 25,
      'delete-user-approval': 25,

      'create-user-approval-step': 26,
      'read-user-approval-step': 26,
      'update-user-approval-step': 26,
      'delete-user-approval-step': 26,

      'create-receipt': 27,
      'read-receipt': 27,
      'update-receipt': 27,
      'delete-receipt': 27,

      'create-receipt-item': 28,
      'read-receipt-item': 28,
      'update-receipt-item': 28,
      'delete-receipt-item': 28,

      'create-company': 30,
      'read-company': 30,
      'update-company': 30,
      'delete-company': 30,

      'create-company-user': 31,
      'read-company-user': 31,
      'update-company-user': 31,
      'delete-company-user': 31,

      'create-category': 32,
      'read-category': 32,
      'update-category': 32,
      'delete-category': 32,

      'create-increase-budget': 33,
      'read-increase-budget': 33,
      'update-increase-budget': 33,
      'delete-increase-budget': 33,

      'create-increase-detail': 34,
      'read-increase-detail': 34,
      'update-increase-detail': 34,
      'delete-increase-detail': 34,

      'create-product-type': 35,
      'read-product-type': 35,
      'update-product-type': 35,
      'delete-product-type': 35,

      'create-product': 36,
      'read-product': 36,
      'update-product': 36,
      'delete-product': 36,

      'create-quota-company': 37,
      'read-quota-company': 37,
      'update-quota-company': 37,
      'delete-quota-company': 37,

      'create-vendor-product': 38,
      'read-vendor-product': 38,
      'update-vendor-product': 38,
      'delete-vendor-product': 38,
    };

    const items = Object.entries(permissionGroupMapping).map(
      ([name, groupId]) => ({
        name,
        guard_name: 'api',
        permission_group_id: groupId,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      }),
    );

    for (const item of items) {
      const existingItem = await _repository.findOne({
        where: { name: item.name },
      });
      if (!existingItem) {
        const createdItem = _repository.create(item);
        await _repository.save(createdItem);
      }
    }

    // for (const item of items) {
    //   const existingItem = await _repository.findOne({ where: { name: item.name } });
    //   if (!existingItem) {
    //     const createdItem = _repository.create(item);
    //     await _repository.save(createdItem);
    //   }
    // }

    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepository);
  }

  private toTitleCase(str: string): string {
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
