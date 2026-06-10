import moment from 'moment-timezone';
import { EntityManager } from 'typeorm';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { UserMailPreferenceOrmEntity } from '@src/common/infrastructure/database/typeorm/user-mail-preference.orm';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import {
  ApprovalNotificationData,
  sendApprovalNotification,
} from './approval-step.utils';

/**
 * Serializable form of {@link ApprovalNotificationData} for jsonb storage.
 * `userEntity` is a domain object backed by private fields + getters, so a raw
 * JSON round-trip would lose `username/email/tel`. We store the scalar user
 * fields instead and rebuild the entity before sending.
 */
export interface PendingNotificationPayload {
  user_approval_step_id: number;
  total: number;
  user: {
    id: number;
    username: string;
    email: string;
    tel: string;
  };
  user_id: number;
  department_name: string;
  type: ApprovalNotificationData['type'];
  titlesString: string;
  token: string;
  approval_rules: ApprovalNotificationData['approval_rules'];
  from_mail?: string;
  code?: string;
  currency?: string;
}

/** Parse a Postgres `time` value ('HH:mm:ss' / 'HH:mm') into seconds-of-day. */
function toSeconds(time: string): number | null {
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(time.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  const s = Number(m[3] ?? '0');
  if (h > 23 || min > 59 || s > 59) return null;
  return h * 3600 + min * 60 + s;
}

/**
 * A window is valid only when both bounds parse and it does not cross midnight
 * (start <= end). Crossing-midnight windows are out of scope.
 */
export function isValidWindow(start: string, end: string): boolean {
  const s = toSeconds(start);
  const e = toSeconds(end);
  return s !== null && e !== null && s <= e;
}

/**
 * Returns true when a notification to this user may be sent right now.
 *
 * Treated as unrestricted (true) when: no preference row, `is_enabled` is false,
 * either bound is missing/unparseable, or the configured window is invalid
 * (crossing midnight) — fail-open so mail is never trapped indefinitely.
 */
export function isWithinWindow(
  pref: UserMailPreferenceOrmEntity | null | undefined,
  now: moment.Moment = moment.tz(Timezone.LAOS),
): boolean {
  if (!pref || !pref.is_enabled) return true;
  if (!pref.start_time || !pref.end_time) return true;

  const start = toSeconds(pref.start_time);
  const end = toSeconds(pref.end_time);
  if (start === null || end === null || start > end) return true;

  const current = now.hours() * 3600 + now.minutes() * 60 + now.seconds();
  return current >= start && current <= end;
}

/** Load a user's mail send-window preference, or null when none exists. */
export async function resolveMailWindow(
  manager: EntityManager,
  userId: number,
): Promise<UserMailPreferenceOrmEntity | null> {
  if (!userId) return null;
  return manager.findOne(UserMailPreferenceOrmEntity, {
    where: { user_id: userId },
  });
}

/** Flatten an in-memory notification into a jsonb-safe pending payload. */
export function toPendingPayload(
  data: ApprovalNotificationData,
): PendingNotificationPayload {
  const u = data.userEntity;
  return {
    user_approval_step_id: data.user_approval_step_id,
    total: data.total,
    user: {
      id: data.user_id,
      username: u?.username ?? '',
      email: u?.email ?? '',
      tel: u?.tel ?? '',
    },
    user_id: data.user_id,
    department_name: data.department_name,
    type: data.type,
    titlesString: data.titlesString,
    token: data.token,
    approval_rules: data.approval_rules,
    from_mail: data.from_mail,
    code: data.code,
    currency: data.currency,
  };
}

/** Minimal persistence port needed to defer a notification. */
export interface PendingNotificationSink {
  createPending(
    payload: PendingNotificationPayload,
    userId: number,
  ): Promise<void>;
}

/**
 * Dispatch a freshly-built approval notification per recipient. Each approver in
 * `approval_rules` is evaluated against their OWN mail send window:
 *  - in-window (or unrestricted) recipients are sent together in one immediate
 *    notification carrying only their rules;
 *  - each out-of-window recipient is persisted as its own pending record
 *    (one rule, gated by that recipient's user_id) for later delivery.
 *
 * The Approval Server emails each `approval_rules[].email` individually, so
 * filtering the array delivers exactly the intended subset.
 */
export async function dispatchApprovalNotification(
  data: ApprovalNotificationData,
  manager: EntityManager,
  pendingSink: PendingNotificationSink,
): Promise<{ sentCount: number; deferredCount: number }> {
  const rules = data.approval_rules ?? [];
  if (rules.length === 0) {
    return { sentCount: 0, deferredCount: 0 };
  }

  // Resolve each distinct recipient's window once.
  const windowCache = new Map<number, boolean>();
  const isOpenFor = async (userId: number): Promise<boolean> => {
    const cached = windowCache.get(userId);
    if (cached !== undefined) return cached;
    const open = isWithinWindow(await resolveMailWindow(manager, userId));
    windowCache.set(userId, open);
    return open;
  };

  const inWindow: typeof rules = [];
  const deferred: typeof rules = [];
  for (const rule of rules) {
    ((await isOpenFor(rule.user_id)) ? inWindow : deferred).push(rule);
  }

  // Send all in-window recipients in a single call.
  if (inWindow.length > 0) {
    await sendApprovalNotification({ ...data, approval_rules: inWindow });
  }

  // Defer each out-of-window recipient as its own pending record.
  for (const rule of deferred) {
    await pendingSink.createPending(
      toPendingPayload({ ...data, approval_rules: [rule] }),
      rule.user_id,
    );
  }

  return { sentCount: inWindow.length, deferredCount: deferred.length };
}

/** Rebuild a sendable notification (with a real UserEntity) from storage. */
export function fromPendingPayload(
  payload: PendingNotificationPayload,
): ApprovalNotificationData {
  const userEntity = UserEntity.builder()
    .setUserId(new UserId(payload.user.id))
    .setUsername(payload.user.username ?? '')
    .setEmail(payload.user.email ?? '')
    .setTel(payload.user.tel ?? '')
    .build();

  return {
    user_approval_step_id: payload.user_approval_step_id,
    total: payload.total,
    userEntity,
    user_id: payload.user_id,
    department_name: payload.department_name,
    type: payload.type,
    titlesString: payload.titlesString,
    token: payload.token,
    approval_rules: payload.approval_rules,
    from_mail: payload.from_mail,
    code: payload.code,
    currency: payload.currency,
  };
}
