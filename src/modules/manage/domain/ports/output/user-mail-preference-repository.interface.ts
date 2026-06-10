import { UserMailPreferenceOrmEntity } from '@src/common/infrastructure/database/typeorm/user-mail-preference.orm';

export interface MailPreferenceInput {
  start_time: string | null;
  end_time: string | null;
  is_enabled: boolean;
}

/**
 * Read + upsert port for a user's mail send-window preference
 * (`user_mail_preferences`, one row per user).
 */
export interface IUserMailPreferenceRepository {
  /** Current preference for a user, or null when none exists. */
  findByUserId(userId: number): Promise<UserMailPreferenceOrmEntity | null>;

  /** Create the row if absent, otherwise update it (keyed on unique user_id). */
  upsert(
    userId: number,
    data: MailPreferenceInput,
  ): Promise<UserMailPreferenceOrmEntity>;
}
