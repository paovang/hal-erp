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

        const entities = [
            'department', 
            'unit', 
            'document-type', 
            'user', 
            'role', 
            'permission', 
            'department-user', 
            'department-approver', 
            'position',
        ];
        const actions = ['write', 'read', 'update', 'delete'];
    
        const items = [];
    
        for (const entity of entities) {
          for (const action of actions) {
            const name = `${action}-${entity}`;
            items.push({
              name,
              display_name: this.toTitleCase(name),
              description: name,
              created_at: currentDateTime,
              updated_at: currentDateTime,
            });
          }
        }
    
        for (const item of items) {
          const existingItem = await _repository.findOne({ where: { name: item.name } });
          if (!existingItem) {
            const createdItem = _repository.create(item);
            await _repository.save(createdItem);
          }
        }
    
    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepository);
  }

  private toTitleCase(str: string): string {
    return str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }
}