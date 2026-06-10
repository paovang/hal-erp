import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm';

/**
 * Per-user daily window during which approval notification emails may be sent.
 * Times are interpreted in the Laos timezone. When no row exists for a user, or
 * `is_enabled` is false, the user is treated as unrestricted.
 */
@Entity('user_mail_preferences')
export class UserMailPreferenceOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true, unique: true })
  user_id: number;

  // Daily window bounds (same-day, start <= end), stored as wall-clock time.
  @Column({ type: 'time', nullable: true })
  start_time: string | null;

  @Column({ type: 'time', nullable: true })
  end_time: string | null;

  @Column({ type: 'boolean', default: true })
  is_enabled: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserOrmEntity>;
}
