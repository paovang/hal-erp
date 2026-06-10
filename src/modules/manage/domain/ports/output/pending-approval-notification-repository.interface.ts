import { PendingApprovalNotificationOrmEntity } from '@src/common/infrastructure/database/typeorm/pending-approval-notification.orm';
import { PendingNotificationPayload } from '@src/common/utils/mail-window.util';

/**
 * Persistence port for approval notifications that were deferred because the
 * target approver's mail send window was closed.
 */
export interface IPendingApprovalNotificationRepository {
  /** Persist a deferred notification in PENDING state. */
  createPending(
    payload: PendingNotificationPayload,
    userId: number,
  ): Promise<void>;

  /** All notifications still awaiting delivery. */
  findPending(): Promise<PendingApprovalNotificationOrmEntity[]>;

  /** Mark a notification as delivered so it is never sent again. */
  markSent(id: number): Promise<void>;
}
