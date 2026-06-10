import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import {
  isWithinWindow,
  isValidWindow,
  toPendingPayload,
  fromPendingPayload,
} from './mail-window.util';
import { UserMailPreferenceOrmEntity } from '@src/common/infrastructure/database/typeorm/user-mail-preference.orm';
import { ApprovalNotificationData } from './approval-step.utils';
import { EnumRequestApprovalType } from '@src/modules/manage/application/constants/status-key.const';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';

const at = (hhmm: string) => moment.tz(`2026-06-10 ${hhmm}`, Timezone.LAOS);

const pref = (
  over: Partial<UserMailPreferenceOrmEntity>,
): UserMailPreferenceOrmEntity =>
  ({
    id: 1,
    user_id: 7,
    start_time: '08:00:00',
    end_time: '17:00:00',
    is_enabled: true,
    ...over,
  }) as UserMailPreferenceOrmEntity;

describe('isWithinWindow', () => {
  it('is true when the current time is inside the window', () => {
    expect(isWithinWindow(pref({}), at('10:00'))).toBe(true);
  });

  it('is true at the exact bounds (inclusive)', () => {
    expect(isWithinWindow(pref({}), at('08:00'))).toBe(true);
    expect(isWithinWindow(pref({}), at('17:00'))).toBe(true);
  });

  it('is false before the window opens', () => {
    expect(isWithinWindow(pref({}), at('06:00'))).toBe(false);
  });

  it('is false after the window closes', () => {
    expect(isWithinWindow(pref({}), at('22:00'))).toBe(false);
  });

  it('treats a missing preference as unrestricted', () => {
    expect(isWithinWindow(null, at('22:00'))).toBe(true);
    expect(isWithinWindow(undefined, at('03:00'))).toBe(true);
  });

  it('treats a disabled preference as unrestricted', () => {
    expect(isWithinWindow(pref({ is_enabled: false }), at('22:00'))).toBe(true);
  });

  it('fails open when bounds are missing', () => {
    expect(isWithinWindow(pref({ start_time: null }), at('22:00'))).toBe(true);
  });

  it('fails open on a crossing-midnight (invalid) window', () => {
    expect(
      isWithinWindow(
        pref({ start_time: '22:00:00', end_time: '06:00:00' }),
        at('23:00'),
      ),
    ).toBe(true);
  });
});

describe('isValidWindow', () => {
  it('accepts same-day windows', () => {
    expect(isValidWindow('08:00', '17:00')).toBe(true);
    expect(isValidWindow('08:00:00', '08:00:00')).toBe(true);
  });

  it('rejects crossing-midnight and unparseable windows', () => {
    expect(isValidWindow('22:00', '06:00')).toBe(false);
    expect(isValidWindow('nope', '17:00')).toBe(false);
  });
});

describe('pending payload round-trip', () => {
  it('preserves user contact fields through serialization', () => {
    const userEntity = UserEntity.builder()
      .setUserId(new UserId(42))
      .setUsername('approver')
      .setEmail('approver@example.com')
      .setTel('2055512345')
      .build();

    const data: ApprovalNotificationData = {
      user_approval_step_id: 99,
      total: 1500,
      userEntity,
      user_id: 42,
      department_name: 'Finance',
      type: EnumRequestApprovalType.PR,
      titlesString: 'Buy stuff',
      token: 'tok-123',
      approval_rules: [
        { email: 'approver@example.com', token: 'tok-123', user_id: 42 },
      ],
      from_mail: 'requester@example.com',
      code: 'PR-0001',
      currency: 'LAK',
    };

    // Simulate jsonb storage + retrieval.
    const stored = JSON.parse(JSON.stringify(toPendingPayload(data)));
    const rebuilt = fromPendingPayload(stored);

    expect(rebuilt.userEntity.username).toBe('approver');
    expect(rebuilt.userEntity.email).toBe('approver@example.com');
    expect(rebuilt.userEntity.tel).toBe('2055512345');
    expect(rebuilt.user_id).toBe(42);
    expect(rebuilt.token).toBe('tok-123');
    expect(rebuilt.type).toBe(EnumRequestApprovalType.PR);
    expect(rebuilt.approval_rules).toEqual(data.approval_rules);
    expect(rebuilt.code).toBe('PR-0001');
  });
});
