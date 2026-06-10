import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PendingApprovalNotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
}

/**
 * An approval notification that was deferred because the target approver's mail
 * send window was closed at approval time. The full serialized send payload is
 * stored so the scheduler can deliver it later, byte-identical to an immediate
 * send, without re-resolving approvers/tokens.
 */
@Entity('pending_approval_notifications')
export class PendingApprovalNotificationOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  // Target approver whose window gates delivery.
  @Column({ type: 'int', unsigned: true })
  user_id: number;

  // Serialized PendingNotificationPayload (see mail-window.util.ts).
  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({
    type: 'varchar',
    length: 20,
    default: PendingApprovalNotificationStatus.PENDING,
  })
  status: PendingApprovalNotificationStatus;

  @Column({ type: 'timestamp', nullable: true })
  sent_at: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
