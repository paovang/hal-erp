import * as approvalStep from './approval-step.utils';
import { dispatchApprovalNotification } from './mail-window.util';
import { PendingApprovalNotificationScheduler } from '@src/modules/manage/application/schedulers/pending-approval-notification.scheduler';
import { EnumRequestApprovalType } from '@src/modules/manage/application/constants/status-key.const';

/**
 * Production scenario (step 2126): a DEPARTMENT step resolves TWO approvers —
 *   user 119 (budget)      → no window (unrestricted)
 *   user 120 (budget_head) → window 17:00–17:30
 * A approves at 16:46. Per-recipient deferral must:
 *   - email 119 immediately,
 *   - hold 120 and let the scheduler deliver it once 17:00 arrives.
 *
 * Laos (Asia/Vientiane) is UTC+7, no DST — times pinned with +07:00.
 */
describe('SCENARIO: multi-approver step, one windowed (prod step 2126)', () => {
  const win120 = {
    is_enabled: true,
    start_time: '17:00:00',
    end_time: '17:30:00',
  };

  const rule = (user_id: number) => ({
    email: `u${user_id}@x.com`,
    token: `tok-${user_id}`,
    user_id,
  });

  const data = {
    user_id: 119,
    userEntity: { username: 'budget', email: 'u119@x.com', tel: '2052145591' },
    type: EnumRequestApprovalType.PR,
    approval_rules: [rule(119), rule(120)],
  } as any;

  // 119 unrestricted (null), 120 has the 17:00–17:30 window
  const managerWithWindows = () =>
    ({
      findOne: jest.fn((_e: any, opts: any) =>
        Promise.resolve(opts.where.user_id === 120 ? win120 : null),
      ),
    }) as any;

  let sink: { createPending: jest.Mock };

  beforeEach(() => {
    sink = { createPending: jest.fn() };
    jest
      .spyOn(approvalStep, 'sendApprovalNotification')
      .mockResolvedValue(undefined as any);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('A approves at 16:46 → 119 emailed now, 120 deferred', async () => {
    jest.setSystemTime(new Date('2026-06-10T16:46:00+07:00'));
    const r = await dispatchApprovalNotification(
      data,
      managerWithWindows(),
      sink,
    );

    expect(r).toEqual({ sentCount: 1, deferredCount: 1 });

    // immediate send carries ONLY user 119
    const sentArg = (approvalStep.sendApprovalNotification as jest.Mock).mock
      .calls[0][0];
    expect(sentArg.approval_rules).toEqual([rule(119)]);

    // user 120 deferred as its own pending row
    expect(sink.createPending).toHaveBeenCalledTimes(1);
    expect(sink.createPending.mock.calls[0][1]).toBe(120);
    expect(sink.createPending.mock.calls[0][0].approval_rules).toEqual([
      rule(120),
    ]);
  });

  describe('scheduler delivers user 120 when their window opens', () => {
    let repo: any;
    let scheduler: PendingApprovalNotificationScheduler;
    const pendingRow120 = {
      id: 55,
      user_id: 120,
      payload: {
        user_id: 120,
        user: data.userEntity,
        approval_rules: [rule(120)],
      },
      status: 'PENDING',
    };

    beforeEach(() => {
      repo = {
        findPending: jest.fn().mockResolvedValue([pendingRow120]),
        markSent: jest.fn(),
        createPending: jest.fn(),
      };
      const dataSource = { manager: managerWithWindows() } as any;
      scheduler = new PendingApprovalNotificationScheduler(repo, dataSource);
    });

    it('16:50 (before 17:00) → 120 stays PENDING', async () => {
      jest.setSystemTime(new Date('2026-06-10T16:50:00+07:00'));
      await scheduler.drainPending();

      expect(approvalStep.sendApprovalNotification).not.toHaveBeenCalled();
      expect(repo.markSent).not.toHaveBeenCalled();
    });

    it('17:05 (window open) → 120 sent and marked SENT', async () => {
      jest.setSystemTime(new Date('2026-06-10T17:05:00+07:00'));
      await scheduler.drainPending();

      expect(approvalStep.sendApprovalNotification).toHaveBeenCalledTimes(1);
      expect(repo.markSent).toHaveBeenCalledWith(55);
    });
  });
});
