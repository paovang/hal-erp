import { PendingApprovalNotificationScheduler } from './pending-approval-notification.scheduler';
import * as mailWindow from '@src/common/utils/mail-window.util';
import * as approvalStep from '@src/common/utils/approval-step.utils';
import { IPendingApprovalNotificationRepository } from '@src/modules/manage/domain/ports/output/pending-approval-notification-repository.interface';

describe('PendingApprovalNotificationScheduler', () => {
  let repo: jest.Mocked<IPendingApprovalNotificationRepository>;
  let scheduler: PendingApprovalNotificationScheduler;

  const dataSource = { manager: {} } as any;
  const row = (id: number, user_id: number) =>
    ({ id, user_id, payload: { user_id }, status: 'PENDING' }) as any;

  beforeEach(() => {
    repo = {
      createPending: jest.fn(),
      findPending: jest.fn(),
      markSent: jest.fn(),
    };
    scheduler = new PendingApprovalNotificationScheduler(repo, dataSource);

    jest.spyOn(mailWindow, 'resolveMailWindow').mockResolvedValue(null);
    jest
      .spyOn(mailWindow, 'fromPendingPayload')
      .mockImplementation((p: any) => p);
    jest
      .spyOn(approvalStep, 'sendApprovalNotification')
      .mockResolvedValue(undefined as any);
  });

  afterEach(() => jest.restoreAllMocks());

  it('does nothing when there are no pending rows', async () => {
    repo.findPending.mockResolvedValue([]);
    await scheduler.drainPending();
    expect(approvalStep.sendApprovalNotification).not.toHaveBeenCalled();
    expect(repo.markSent).not.toHaveBeenCalled();
  });

  it('sends and marks SENT when the window is open', async () => {
    repo.findPending.mockResolvedValue([row(1, 7)]);
    jest.spyOn(mailWindow, 'isWithinWindow').mockReturnValue(true);

    await scheduler.drainPending();

    expect(approvalStep.sendApprovalNotification).toHaveBeenCalledTimes(1);
    expect(repo.markSent).toHaveBeenCalledWith(1);
  });

  it('leaves the row PENDING when the window is still closed', async () => {
    repo.findPending.mockResolvedValue([row(2, 8)]);
    jest.spyOn(mailWindow, 'isWithinWindow').mockReturnValue(false);

    await scheduler.drainPending();

    expect(approvalStep.sendApprovalNotification).not.toHaveBeenCalled();
    expect(repo.markSent).not.toHaveBeenCalled();
  });

  it('leaves the row PENDING when sending fails', async () => {
    repo.findPending.mockResolvedValue([row(3, 9)]);
    jest.spyOn(mailWindow, 'isWithinWindow').mockReturnValue(true);
    (approvalStep.sendApprovalNotification as jest.Mock).mockRejectedValue(
      new Error('approval server down'),
    );

    await scheduler.drainPending();

    expect(repo.markSent).not.toHaveBeenCalled();
  });

  it('processes each row independently; one failure does not block others', async () => {
    repo.findPending.mockResolvedValue([row(4, 1), row(5, 2)]);
    jest.spyOn(mailWindow, 'isWithinWindow').mockReturnValue(true);
    (approvalStep.sendApprovalNotification as jest.Mock)
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(undefined);

    await scheduler.drainPending();

    expect(repo.markSent).toHaveBeenCalledTimes(1);
    expect(repo.markSent).toHaveBeenCalledWith(5);
  });
});
