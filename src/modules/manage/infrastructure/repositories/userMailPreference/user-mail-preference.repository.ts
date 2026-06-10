import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserMailPreferenceOrmEntity } from '@src/common/infrastructure/database/typeorm/user-mail-preference.orm';
import {
  IUserMailPreferenceRepository,
  MailPreferenceInput,
} from '@src/modules/manage/domain/ports/output/user-mail-preference-repository.interface';

@Injectable()
export class UserMailPreferenceRepository
  implements IUserMailPreferenceRepository
{
  constructor(
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async findByUserId(
    userId: number,
  ): Promise<UserMailPreferenceOrmEntity | null> {
    return this._dataSource
      .getRepository(UserMailPreferenceOrmEntity)
      .findOne({ where: { user_id: userId } });
  }

  async upsert(
    userId: number,
    data: MailPreferenceInput,
  ): Promise<UserMailPreferenceOrmEntity> {
    const repo = this._dataSource.getRepository(UserMailPreferenceOrmEntity);
    const existing = await repo.findOne({ where: { user_id: userId } });

    const entity = repo.create({
      ...(existing ?? { user_id: userId }),
      start_time: data.start_time,
      end_time: data.end_time,
      is_enabled: data.is_enabled,
    });

    return repo.save(entity);
  }
}
