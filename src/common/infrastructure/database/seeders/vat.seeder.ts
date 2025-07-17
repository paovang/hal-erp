import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Timezone } from 'src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DateFormat } from 'src/common/domain/value-objects/date-format.vo';
import { HelperSeeder } from './helper.seeder';
import { SeederLogOrmEntity } from '../typeorm/seeder-log.orm';
import { VatOrmEntity } from '../typeorm/vat.orm';

@Injectable()
export class VatSeeder {
  private readonly SEEDER_NAME = 'vat_seeders';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepository = manager.getRepository(SeederLogOrmEntity);
    const isExecute = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepository,
    );
    if (isExecute) return [];
    const _respository = manager.getRepository(VatOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    const items = [
      {
        id: 1,
        amount: 10,
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
    ];

    for (const item of items) {
      const existingItem = await _respository.findOne({
        where: { amount: item.amount },
      });
      if (!existingItem) {
        const items = _respository.create(item);
        await _respository.save(items);
      }
    }
    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepository);
  }
}
