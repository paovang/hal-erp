import { Inject, Injectable } from '@nestjs/common';
import { HelperSeeder } from './helper.seeder';
import { EntityManager } from 'typeorm';
import { SeederLogOrmEntity } from '../typeorm/seeder-log.orm';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { ProvinceOrmEntity } from '../typeorm/province.orm';

@Injectable()
export class ProvinceSeeder {
  private readonly SEEDER_NAME = 'province_seeders';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepository = manager.getRepository(SeederLogOrmEntity);
    const isExecute = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepository,
    );
    if (isExecute) return [];
    const _respository = manager.getRepository(ProvinceOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    const items = [
      {
        name: 'ແຂວງ ຜົ້ງສາລີ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ຫຼວງນ້ຳທາ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ອຸດົມໄຊ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ບໍ່ແກ້ວ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ຫຼວງພະບາງ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ໄຊຍະບູລີ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ຊຽງຂວາງ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ວຽງຈັນ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ບໍລິຄຳໄຊ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ຄຳມ່ວນ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ສະຫວັນນະເຂດ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ສາລະວັນ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ເຊກອງ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ຈຳປາສັກ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ອັດຕະປື',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ໄຊສົມບູນ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ຫົວພັນ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        name: 'ແຂວງ ນະຄອນຫຼວງວຽງຈັນ',
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
