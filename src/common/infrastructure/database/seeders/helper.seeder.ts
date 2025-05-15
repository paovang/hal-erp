import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { DateFormat } from 'src/common/domain/value-objects/date-format.vo';
import { Timezone } from 'src/common/domain/value-objects/timezone.vo';
import { Repository } from 'typeorm';
import { SeederLog } from '../typeorm/seeder-log.orm';

@Injectable()
export class HelperSeeder {
  async existingLog(seederName: string, repository: Repository<SeederLog>) {
    const existingLog = await repository.findOne({
      where: { name: seederName },
    });
    if (existingLog) {
      console.log(`${seederName} already executed. skipping...`);
      return true;
    }
    return false;
  }

  async executingLog(seederName: string, repository: Repository<SeederLog>) {
    try {
      const seederLog = repository.create({
        name: seederName,
        created_at: moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT),
      });
      await repository.save(seederLog);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
