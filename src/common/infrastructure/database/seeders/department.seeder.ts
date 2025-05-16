import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DepartmentOrmEntity } from '../typeorm/department.orm';
import { Timezone } from 'src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DateFormat } from 'src/common/domain/value-objects/date-format.vo';
import { HelperSeeder } from './helper.seeder';
import { SeederLogOrmEntity } from '../typeorm/seeder-log.orm';

@Injectable()
export class DepartmentSeeder {
  private readonly SEEDER_NAME = 'user_seeders';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepository = manager.getRepository(SeederLogOrmEntity);
    const isExecute = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepository,
    );
    if (isExecute) return [];
    const _respository = manager.getRepository(DepartmentOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    const items = [
      {
        code: 'PO-001',
        name: 'ພະເເນກ ຈັດຊື້ - ຈັດຈ້າງ',
        email: 'department_po@gmail.com',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        code: 'PG-001',
        name: 'ພະເເນກ ບໍລິຫານ',
        email: 'department@gmail.com',
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
