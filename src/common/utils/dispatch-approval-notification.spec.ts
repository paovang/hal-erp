import * as approvalStep from './approval-step.utils';
import { dispatchApprovalNotification } from './mail-window.util';
import { EnumRequestApprovalType } from '@src/modules/manage/application/constants/status-key.const';

/**
 * Per-recipient send/defer decision invoked by ApproveStepCommandHandler after
 * the approval transaction commits. Each approver in approval_rules is evaluated
 * against their OWN window. Uses real window logic (intra-module calls can't be
 * spied), driven by a fake manager keyed on user_id + a fixed system time.
 *
 * Vientiane is UTC+7 with no DST, so an explicit +07:00 offset pins wall-clock.
 */
describe('dispatchApprovalNotification (per-recipient)', () => {
  const window = (start: string, end: string) => ({
    is_enabled: true,
    start_time: start,
    end_time: end,
  });

  // manager.findOne({ where: { user_id } }) → per-user preference from the map
  const managerWithWindows = (byUser: Record<number, any>) =>
    ({
      findOne: jest.fn((_e: any, opts: any) =>
        Promise.resolve(byUser[opts.where.user_id] ?? null),
      ),
    }) as any;

  const rule = (user_id: number) => ({
    email: `u${user_id}@x.com`,
    token: `tok-${user_id}`,
    user_id,
  });

  const dataWith = (rules: any[]) =>
    ({
      user_id: rules[0]?.user_id ?? 0,
      userEntity: { username: 'a', email: 'a@x.com', tel: '2055500000' },
      type: EnumRequestApprovalType.PR,
      approval_rules: rules,
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

  it('single unrestricted approver → sent immediately', async () => {
    jest.setSystemTime(new Date('2026-06-10T22:00:00+07:00'));
    const r = await dispatchApprovalNotification(
      dataWith([rule(7)]),
      managerWithWindows({}),
      sink,
    );

    expect(r).toEqual({ sentCount: 1, deferredCount: 0 });
    expect(approvalStep.sendApprovalNotification).toHaveBeenCalledTimes(1);
    expect(sink.createPending).not.toHaveBeenCalled();
  });

  it('single approver outside window → deferred, no send', async () => {
    jest.setSystemTime(new Date('2026-06-10T22:00:00+07:00'));
    const r = await dispatchApprovalNotification(
      dataWith([rule(7)]),
      managerWithWindows({ 7: window('08:00', '17:00') }),
      sink,
    );

    expect(r).toEqual({ sentCount: 0, deferredCount: 1 });
    expect(approvalStep.sendApprovalNotification).not.toHaveBeenCalled();
    expect(sink.createPending).toHaveBeenCalledTimes(1);
    expect(sink.createPending.mock.calls[0][1]).toBe(7);
  });

  it('mixed: one inside-window, one outside → split send + defer', async () => {
    // 12:30: user 1 unrestricted (sent), user 2 window 16:00–20:00 (deferred)
    jest.setSystemTime(new Date('2026-06-10T12:30:00+07:00'));
    const r = await dispatchApprovalNotification(
      dataWith([rule(1), rule(2)]),
      managerWithWindows({ 2: window('16:00', '20:00') }),
      sink,
    );

    expect(r).toEqual({ sentCount: 1, deferredCount: 1 });

    // immediate send carries ONLY the in-window recipient (user 1)
    expect(approvalStep.sendApprovalNotification).toHaveBeenCalledTimes(1);
    const sentArg = (approvalStep.sendApprovalNotification as jest.Mock).mock
      .calls[0][0];
    expect(sentArg.approval_rules).toEqual([rule(1)]);

    // one pending row for user 2 only
    expect(sink.createPending).toHaveBeenCalledTimes(1);
    expect(sink.createPending.mock.calls[0][1]).toBe(2);
    expect(sink.createPending.mock.calls[0][0].approval_rules).toEqual([
      rule(2),
    ]);
  });

  it('all outside windows → no send, one pending per recipient', async () => {
    jest.setSystemTime(new Date('2026-06-10T22:00:00+07:00'));
    const r = await dispatchApprovalNotification(
      dataWith([rule(1), rule(2)]),
      managerWithWindows({
        1: window('08:00', '17:00'),
        2: window('16:00', '20:00'),
      }),
      sink,
    );

    expect(r).toEqual({ sentCount: 0, deferredCount: 2 });
    expect(approvalStep.sendApprovalNotification).not.toHaveBeenCalled();
    expect(sink.createPending).toHaveBeenCalledTimes(2);
    expect(sink.createPending.mock.calls.map((c) => c[1]).sort()).toEqual([
      1, 2,
    ]);
  });

  it('all inside/unrestricted → single send with every rule, no pending', async () => {
    jest.setSystemTime(new Date('2026-06-10T10:00:00+07:00'));
    const r = await dispatchApprovalNotification(
      dataWith([rule(1), rule(2)]),
      managerWithWindows({ 2: window('08:00', '17:00') }),
      sink,
    );

    expect(r).toEqual({ sentCount: 2, deferredCount: 0 });
    expect(approvalStep.sendApprovalNotification).toHaveBeenCalledTimes(1);
    const sentArg = (approvalStep.sendApprovalNotification as jest.Mock).mock
      .calls[0][0];
    expect(sentArg.approval_rules).toEqual([rule(1), rule(2)]);
    expect(sink.createPending).not.toHaveBeenCalled();
  });

  it('no recipients → no-op', async () => {
    jest.setSystemTime(new Date('2026-06-10T10:00:00+07:00'));
    const r = await dispatchApprovalNotification(
      dataWith([]),
      managerWithWindows({}),
      sink,
    );

    expect(r).toEqual({ sentCount: 0, deferredCount: 0 });
    expect(approvalStep.sendApprovalNotification).not.toHaveBeenCalled();
    expect(sink.createPending).not.toHaveBeenCalled();
  });
});
