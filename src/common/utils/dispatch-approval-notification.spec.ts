import * as approvalStep from './approval-step.utils';
import { dispatchApprovalNotification } from './mail-window.util';
import { EnumRequestApprovalType } from '@src/modules/manage/application/constants/status-key.const';

/**
 * Covers the send-vs-defer decision invoked by ApproveStepCommandHandler after
 * the approval transaction commits. Uses the real window logic (intra-module
 * calls can't be spied), driving it via a fake manager + fixed system time.
 *
 * Vientiane is UTC+7 with no DST, so an explicit +07:00 offset pins wall-clock.
 */
describe('dispatchApprovalNotification (handler decision)', () => {
  const window = {
    is_enabled: true,
    start_time: '08:00:00',
    end_time: '17:00:00',
  };
  const managerWith = (pref: any) =>
    ({ findOne: jest.fn().mockResolvedValue(pref) }) as any;

  const data = {
    user_id: 7,
    userEntity: { username: 'a', email: 'a@x.com', tel: '2055500000' },
    type: EnumRequestApprovalType.PR,
    approval_rules: [],
  } as any;

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

  it('sends immediately when the approver has no window (unrestricted)', async () => {
    jest.setSystemTime(new Date('2026-06-10T22:00:00+07:00'));
    const result = await dispatchApprovalNotification(
      data,
      managerWith(null),
      sink,
    );

    expect(result.sent).toBe(true);
    expect(approvalStep.sendApprovalNotification).toHaveBeenCalledWith(data);
    expect(sink.createPending).not.toHaveBeenCalled();
  });

  it('sends immediately when current time is inside the window', async () => {
    jest.setSystemTime(new Date('2026-06-10T10:00:00+07:00'));
    const result = await dispatchApprovalNotification(
      data,
      managerWith(window),
      sink,
    );

    expect(result.sent).toBe(true);
    expect(approvalStep.sendApprovalNotification).toHaveBeenCalledWith(data);
    expect(sink.createPending).not.toHaveBeenCalled();
  });

  it('defers (persists pending, no send) when current time is outside the window', async () => {
    jest.setSystemTime(new Date('2026-06-10T22:00:00+07:00'));
    const result = await dispatchApprovalNotification(
      data,
      managerWith(window),
      sink,
    );

    expect(result.sent).toBe(false);
    expect(approvalStep.sendApprovalNotification).not.toHaveBeenCalled();
    expect(sink.createPending).toHaveBeenCalledTimes(1);
    expect(sink.createPending.mock.calls[0][1]).toBe(7);
  });
});
