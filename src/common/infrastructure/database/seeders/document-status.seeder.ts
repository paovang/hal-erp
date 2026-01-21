import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DocumentStatusOrmEntity } from '../typeorm/document-statuse.orm';
import { Timezone } from 'src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DateFormat } from 'src/common/domain/value-objects/date-format.vo';
import { HelperSeeder } from './helper.seeder';
import { SeederLogOrmEntity } from '../typeorm/seeder-log.orm';

@Injectable()
export class DocumentStatusSeeder {
  private readonly SEEDER_NAME = 'document_status_seeders';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    const seederLogRepository = manager.getRepository(SeederLogOrmEntity);
    const isExecute = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepository,
    );
    if (isExecute) return [];

    const _respository = manager.getRepository(DocumentStatusOrmEntity);
    const currentDateTime = moment
      .tz(Timezone.LAOS)
      .format(DateFormat.DATETIME_FORMAT);

    const items = [
      {
        id: 1,
        name: 'PENDING',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 2,
        name: 'APPROVED',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 3,
        name: 'REJECTED',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
      {
        id: 4,
        name: 'CANCELLED',
        created_at: currentDateTime,
        updated_at: currentDateTime,
      },
    ];

    for (const item of items) {
      const existingItem = await _respository.findOne({
        where: { id: item.id },
      });
      if (!existingItem) {
        const items = _respository.create(item);
        await _respository.save(items);
      }
    }
    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepository);
  }
}
