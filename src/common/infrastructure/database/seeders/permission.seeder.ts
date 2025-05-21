import { Inject, Injectable } from "@nestjs/common";
import { HelperSeeder } from "./helper.seeder";
import { EntityManager } from "typeorm";
import { SeederLogOrmEntity } from "../typeorm/seeder-log.orm";
import { PermissionOrmEntity } from "../typeorm/permission.orm";
import { Timezone } from "@src/common/domain/value-objects/timezone.vo";
import { DateFormat } from "@src/common/domain/value-objects/date-format.vo";
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
      'write-department': 1,
      'read-department': 1,
      'update-department': 1,
      'delete-department': 1,

      'write-unit': 2,
      'read-unit': 2,
      'update-unit': 2,
      'delete-unit': 2,

      'write-position': 3,
      'read-position': 3,
      'update-position': 3,
      'delete-position': 3,

      'write-role': 4,
      'read-role': 4,
      'update-role': 4,
      'delete-role': 4,

      'write-user': 5,
      'read-user': 5,
      'update-user': 5,
      'delete-user': 5,

      'write-permission': 6,
      'read-permission': 6,
      'update-permission': 6,
      'delete-permission': 6,

      'write-document-type': 7,
      'read-document-type': 7,
      'update-document-type': 7,
      'delete-document-type': 7,

      'write-department-user': 8,
      'read-department-user': 8,
      'update-department-user': 8,
      'delete-department-user': 8,

      'write-department-approver': 9,
      'read-department-approver': 9,
      'update-department-approver': 9,
      'delete-department-approver': 9,

      'write-currency': 10,
      'read-currency': 10,
      'update-currency': 10,
      'delete-currency': 10,
    };

    const items = Object.entries(permissionGroupMapping).map(([name, groupId]) => ({
      name,
      guard_name: 'api',
      permission_group_id: groupId,
      created_at: currentDateTime,
      updated_at: currentDateTime,
    }));

    for (const item of items) {
      const existingItem = await _repository.findOne({ where: { name: item.name } });
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
    return str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }
}