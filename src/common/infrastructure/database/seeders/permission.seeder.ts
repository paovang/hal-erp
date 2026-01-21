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

      'create-company': 29,
      'read-company': 29,
      'update-company': 29,
      'delete-company': 29,

      'create-company-user': 30,
      'read-company-user': 30,
      'update-company-user': 30,
      'delete-company-user': 30,

      'create-category': 31,
      'read-category': 31,
      'update-category': 31,
      'delete-category': 31,

      'create-increase-budget': 32,
      'read-increase-budget': 32,
      'update-increase-budget': 32,
      'delete-increase-budget': 32,

      'create-increase-detail': 33,
      'read-increase-detail': 33,
      'update-increase-detail': 33,
      'delete-increase-detail': 33,

      'create-product-type': 34,
      'read-product-type': 34,
      'update-product-type': 34,
      'delete-product-type': 34,

      'create-product': 35,
      'read-product': 35,
      'update-product': 35,
      'delete-product': 35,

      'create-quota-company': 36,
      'read-quota-company': 36,
      'update-quota-company': 36,
      'delete-quota-company': 36,

      'create-vendor-product': 37,
      'read-vendor-product': 37,
      'update-vendor-product': 37,
      'delete-vendor-product': 37,

      'create-vat': 38,
      'read-vat': 38,
      'update-vat': 38,
      'delete-vat': 38,

      'create-bank': 39,
      'read-bank': 39,
      'update-bank': 39,
      'delete-bank': 39,

      'create-budget-approval': 40,
      'read-budget-approval': 40,
      'update-budget-approval': 40,
      'delete-budget-approval': 40,

      'create-department-rule': 41,
      'read-department-rule': 41,
      'update-department-rule': 41,
      'delete-department-rule': 41, //
    };

    const items = Object.entries(permissionGroupMapping).map(
      ([name, groupId]) => ({
        name,
        guard_name: 'api',
        display_name: this.toTitleCase(name),
        display_name_lo: this.toTitleCaseLo(name),
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
        // Insert new permission
        const createdItem = _repository.create(item);
        await _repository.save(createdItem);
      } else if (
        !existingItem.display_name_lo ||
        existingItem.display_name_lo === null
      ) {
        // Update existing permission if display_name_lo is missing
        existingItem.display_name_lo = item.display_name_lo;
        existingItem.updated_at = new Date();
        await _repository.save(existingItem);
      }
    }

    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepository);
  }

  private toTitleCase(str: string): string {
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  private toTitleCaseLo(str: string): string {
    // Lao language translations for common permission terms
    const laoTranslations: Record<string, string> = {
      // Actions
      create: 'ສ້າງ',
      read: 'ເບີ່ງ',
      update: 'ແກ້ໄຂ',
      delete: 'ລຶບ',

      // Compound terms (must come before individual words for priority matching)
      'document-type': 'ປະເພດເອກະສານ',
      'department-user': 'ຜູ້ໃຊ້ພະແນກ',
      'department-approver': 'ຜູ້ອະນຸມັດພະແນກ',
      'vendor-bank-account': 'ບັນຊີທະນາຄານຜູ້ສະໜອງ',
      'budget-account': 'ບັນຊີງົບປະມານ',
      'budget-item': 'ລາຍການງົບປະມານ',
      'budget-item-detail': 'ລາຍລະອຽດລາຍການງົບປະມານ',
      'budget-approval-rule': 'ກົດລະບຽບອະນຸມັດງົບປະມານ',
      'approval-workflow': 'ຂະບວນການອະນຸມັດ',
      'approval-workflow-step': 'ຂັ້ນຕອນຂະບວນການອະນຸມັດ',
      'purchase-request': 'ຄຳຮ້ອງສັ່ງຊື້',
      'purchase-request-item': 'ລາຍການຄຳຮ້ອງສັ່ງຊື້',
      'purchase-order': 'ຄຳສັ່ງຊື້',
      'purchase-order-item': 'ລາຍການຄຳສັ່ງຊື້',
      'purchase-selected-vendor': 'ເລືອກຜູ້ສະໜອງ',
      'user-approval': 'ການອະນຸມັດເອກະສານ',
      'user-approval-step': 'ຂັ້ນຕອນການອະນຸມັດເອກະສານ',
      'receipt-item': 'ລາຍການໃບເບີກຈ່າຍ',
      'company-user': 'ຜູ້ໃຊ້ບໍລິສັດ',
      'increase-budget': 'ຂໍເພີ່ມງົບປະມານ',
      'increase-budget-detail': 'ລາຍລະອຽດການຂໍເພີ່ມງົບປະມານ',
      'product-type': 'ປະເພດສິນຄ້າ',
      'quota-company': 'ໂຄຕ້າບໍລິສັດ',
      'vendor-product': 'ສິນຄ້າຜູ້ສະໜອງ',
      'budget-approval': 'ອະນຸມັດງົບປະມານ',
      'department-rule': 'ກົດລະບຽບພະແນກ',

      // Individual words (fallback)
      department: 'ພະແນກ',
      unit: 'ຫົວໜ່ວຍ',
      position: 'ຕຳແໜ່ງ',
      role: 'ບົດບາດ',
      user: 'ຜູ້ໃຊ້',
      permission: 'ສິດອະນຸຍາດ',
      currency: 'ສະກຸນເງິນ',
      vendor: 'ຜູ້ສະໜອງ',
      bank: 'ທະນາຄານ',
      account: 'ບັນຊີ',
      budget: 'ງົບປະມານ',
      item: 'ລາຍການ',
      detail: 'ລາຍລະອຽດ',
      approval: 'ການອະນຸມັດ',
      approver: 'ຜູ້ອະນຸມັດ',
      workflow: 'ຂະບວນການ',
      step: 'ຂັ້ນຕອນ',
      document: 'ເອກະສານ',
      type: 'ປະເພດ',
      request: 'ຄຳຮ້ອງສັ່ງ',
      order: 'ຄຳສັ່ງ',
      selected: 'ເລືອກ',
      receipt: 'ໃບເບີກຈ່າຍ',
      company: 'ບໍລິສັດ',
      category: 'ໝວດໝູ່',
      increase: 'ເພີ່ມ',
      product: 'ສິນຄ້າ',
      quota: 'ໂຄຕ້າ',
      vat: 'ອາກອມ',
      rule: 'ກົດລະບຽບ',
    };

    // Convert permission name to Lao
    // Extract the action (create, read, update, delete)
    const parts = str.split('-');
    const action = parts[0];

    // Try to match compound phrases first, then individual words
    let result = '';
    if (parts.length > 1) {
      // Join the remaining parts to form the resource name
      const resourceName = parts.slice(1).join('-');

      // Check if the resource name is in translations (for compound terms)
      if (laoTranslations[resourceName]) {
        result = `${laoTranslations[action] || action} ${laoTranslations[resourceName]}`;
      } else {
        // Split compound terms and translate each word
        const resourceParts = parts.slice(1);
        const translatedParts = resourceParts.map(
          (part) => laoTranslations[part] || part,
        );
        result = `${laoTranslations[action] || action} ${translatedParts.join(' ')}`;
      }
    } else {
      result = laoTranslations[str] || str;
    }

    return result.trim();
  }
}
