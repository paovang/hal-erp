import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Timezone } from 'src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DateFormat } from 'src/common/domain/value-objects/date-format.vo';
import { HelperSeeder } from './helper.seeder';
import { SeederLogOrmEntity } from '../typeorm/seeder-log.orm';
import {
  DocumentCategoryCode,
  DocumentCategoryOrmEntity,
} from '../typeorm/document-category.orm';
@Injectable()
export class DocumentCategorySeeder {
  private readonly SEEDER_NAME = 'document_category_seeders';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepository = manager.getRepository(SeederLogOrmEntity);
    const isExecute = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepository,
    );
    if (isExecute) return [];
    const _respository = manager.getRepository(DocumentCategoryOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    const items = [
      {
        code: DocumentCategoryCode.PR,
        name: 'ໃບສະເຫນີຈັດຊື້',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        code: DocumentCategoryCode.PO,
        name: 'ໃບຈັດຊື້',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        code: DocumentCategoryCode.RECEIPT,
        name: 'ໃບຮັບສິນຄ້າ',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        code: DocumentCategoryCode.INVOICE,
        name: 'ໃບໃຫ້ຄ່າສິນຄ້າ',
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
