import { Provider } from '@nestjs/common';
import { PENDING_APPROVAL_NOTIFICATION_REPOSITORY } from '../../constants/inject-key.const';
import { WritePendingApprovalNotificationRepository } from '@src/modules/manage/infrastructure/repositories/pendingApprovalNotification/write.repository';
import { PendingApprovalNotificationScheduler } from '../../schedulers/pending-approval-notification.scheduler';

export const PendingApprovalNotificationProvider: Provider[] = [
  {
    provide: PENDING_APPROVAL_NOTIFICATION_REPOSITORY,
    useClass: WritePendingApprovalNotificationRepository,
  },
  PendingApprovalNotificationScheduler,
];
