import { Inject, Injectable } from '@nestjs/common';
import { HelperSeeder } from './helper.seeder';
import { EntityManager } from 'typeorm';
import { SeederLogOrmEntity } from '../typeorm/seeder-log.orm';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { RoleOrmEntity } from '../typeorm/role.orm';
import moment from 'moment-timezone';

@Injectable()
export class RoleSeeder {
  private readonly SEEDER_NAME = 'role_seeders';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepository = manager.getRepository(SeederLogOrmEntity);
    const isExecute = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepository,
    );
    if (isExecute) return [];
    const _respository = manager.getRepository(RoleOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    const items = [
      {
        name: 'admin',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'super-admin',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'user',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'budget-admin',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'budget-user',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'account-admin',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'account-user',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'finance-admin',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'finance-user',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'procurement-admin',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'procurement-user',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'director',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'company-admin',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'company-user',
        guard_name: 'api',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
    ];

    for (const item of items) {
      const existingItem = await _respository.findOne({
        where: { name: item.name },
      });
      //
      if (!existingItem) {
        const items = _respository.create(item);
        await _respository.save(items);
      }
    }
    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepository);
  }
}
