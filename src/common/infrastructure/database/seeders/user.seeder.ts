import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { HelperSeeder } from './helper.seeder';
import { SeederLogOrmEntity } from '../typeorm/seeder-log.orm';
import { UserOrmEntity } from '../typeorm/user.orm';
import { RoleOrmEntity } from '../typeorm/role.orm';

import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeeder {
  private readonly SEEDER_NAME = 'user_seeders';

  constructor(@Inject() private readonly _helper: HelperSeeder) {}

  async seed(manager: EntityManager) {
    /* ------------------------------------------------------------------ */
    /* 1.  Skip if we already ran                                         */
    /* ------------------------------------------------------------------ */
    const seederLogRepo = manager.getRepository(SeederLogOrmEntity);
    const done = await this._helper.existingLog(
      this.SEEDER_NAME,
      seederLogRepo,
    );
    if (done) return;

    /* ------------------------------------------------------------------ */
    /* 2.  Get repositories                                               */
    /* ------------------------------------------------------------------ */
    const userRepo = manager.getRepository(UserOrmEntity);
    const roleRepo = manager.getRepository(RoleOrmEntity);

    /* ------------------------------------------------------------------ */
    /* 3.  Pull the three roles                                           */
    /* ------------------------------------------------------------------ */
    const [adminRole, superAdminRole, userRole] = await Promise.all([
      roleRepo.findOne({ where: { name: 'admin' } }),
      roleRepo.findOne({ where: { name: 'super-admin' } }),
      roleRepo.findOne({ where: { name: 'user' } }),
    ]);

    if (!adminRole || !superAdminRole || !userRole) {
      throw new Error(
        '[Seeder] One or more required roles are missing. Seed roles first.',
      );
    }

    /* ------------------------------------------------------------------ */
    /* 4.  Prepare seed data                                              */
    /* ------------------------------------------------------------------ */
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);

    type SeedItem = Partial<UserOrmEntity> & { roles: RoleOrmEntity[] };

    const items: SeedItem[] = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 12),
        roles: [adminRole],
        created_at: now as unknown as Date,
        updated_at: now as unknown as Date,
      },
      {
        username: 'super-admin',
        email: 'super-admin@example.com',
        password: await bcrypt.hash('super-admin123', 12),
        roles: [superAdminRole],
        created_at: now as unknown as Date,
        updated_at: now as unknown as Date,
      },
      {
        username: 'user',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 12),
        roles: [userRole],
        created_at: now as unknown as Date,
        updated_at: now as unknown as Date,
      },
    ];

    /* ------------------------------------------------------------------ */
    /* 5.  Up-sert users and attach roles                                 */
    /* ------------------------------------------------------------------ */
    for (const item of items) {
      const existing = await userRepo.findOne({
        where: { email: item.email },
        relations: ['roles'],
      });

      if (existing) {
        // make sure the existing user has the role(s)
        const currentRoleIds = existing.roles.map((r) => r.id);
        for (const role of item.roles) {
          if (!currentRoleIds.includes(role.id)) {
            existing.roles.push(role);
          }
        }
        await userRepo.save(existing); // fills user_has_roles
        continue;
      }

      const user = userRepo.create(item); // roles included here
      await userRepo.save(user); // fills user_has_roles
    }

    /* ------------------------------------------------------------------ */
    /* 6.  Mark seeder as executed                                        */
    /* ------------------------------------------------------------------ */
    await this._helper.executingLog(this.SEEDER_NAME, seederLogRepo);
  }
}
