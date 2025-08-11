import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { UserTypeEnum } from '@src/common/constants/user-type.enum';
import { UserOrmEntity } from './user.orm';

@Entity('user_types')
export class UserTypeOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'bigint' })
  user_id: number;

  @Index()
  @Column({ type: 'enum', enum: UserTypeEnum, nullable: true })
  name?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @ManyToOne(() => UserOrmEntity, (user) => user.user_types)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserOrmEntity>;
}
