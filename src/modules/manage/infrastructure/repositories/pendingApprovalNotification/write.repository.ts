import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  PendingApprovalNotificationOrmEntity,
  PendingApprovalNotificationStatus,
} from '@src/common/infrastructure/database/typeorm/pending-approval-notification.orm';
import { PendingNotificationPayload } from '@src/common/utils/mail-window.util';
import { IPendingApprovalNotificationRepository } from '@src/modules/manage/domain/ports/output/pending-approval-notification-repository.interface';

@Injectable()
export class WritePendingApprovalNotificationRepository
  implements IPendingApprovalNotificationRepository
{
  constructor(
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async createPending(
    payload: PendingNotificationPayload,
    userId: number,
  ): Promise<void> {
    const repo = this._dataSource.getRepository(
      PendingApprovalNotificationOrmEntity,
    );
    await repo.save(
      repo.create({
        user_id: userId,
        payload: payload as unknown as Record<string, any>,
        status: PendingApprovalNotificationStatus.PENDING,
        sent_at: null,
      }),
    );
  }

  async findPending(): Promise<PendingApprovalNotificationOrmEntity[]> {
    return this._dataSource
      .getRepository(PendingApprovalNotificationOrmEntity)
      .find({
        where: { status: PendingApprovalNotificationStatus.PENDING },
        order: { created_at: 'ASC' },
      });
  }

  async markSent(id: number): Promise<void> {
    await this._dataSource
      .getRepository(PendingApprovalNotificationOrmEntity)
      .update(id, {
        status: PendingApprovalNotificationStatus.SENT,
        sent_at: new Date(),
      });
  }
}
