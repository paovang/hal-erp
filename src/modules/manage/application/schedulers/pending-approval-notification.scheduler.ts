import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import {
  fromPendingPayload,
  isWithinWindow,
  resolveMailWindow,
  PendingNotificationPayload,
} from '@src/common/utils/mail-window.util';
import { sendApprovalNotification } from '@src/common/utils/approval-step.utils';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PENDING_APPROVAL_NOTIFICATION_REPOSITORY } from '../constants/inject-key.const';
import { IPendingApprovalNotificationRepository } from '@src/modules/manage/domain/ports/output/pending-approval-notification-repository.interface';

/**
 * Drains deferred approval notifications: any pending record whose target
 * approver's mail window is now open (or who is unrestricted) is delivered and
 * marked SENT. Closed-window and failed sends stay PENDING for a later run.
 */
@Injectable()
export class PendingApprovalNotificationScheduler {
  private readonly logger = new Logger(
    PendingApprovalNotificationScheduler.name,
  );

  constructor(
    @Inject(PENDING_APPROVAL_NOTIFICATION_REPOSITORY)
    private readonly _pendingRepo: IPendingApprovalNotificationRepository,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  @Cron(process.env.PENDING_MAIL_CRON || CronExpression.EVERY_5_MINUTES)
  async drainPending(): Promise<void> {
    const pending = await this._pendingRepo.findPending();
    if (pending.length === 0) return;

    const now = moment.tz(Timezone.LAOS);
    const manager = this._dataSource.manager;

    for (const row of pending) {
      try {
        const pref = await resolveMailWindow(manager, row.user_id);
        if (!isWithinWindow(pref, now)) continue; // window still closed

        const payload = row.payload as unknown as PendingNotificationPayload;
        await sendApprovalNotification(fromPendingPayload(payload));
        await this._pendingRepo.markSent(row.id);
      } catch (error: any) {
        // Leave the row PENDING so it is retried on the next run.
        this.logger.error(
          `Failed to deliver pending approval notification ${row.id}: ${error?.message}`,
        );
      }
    }
  }
}
