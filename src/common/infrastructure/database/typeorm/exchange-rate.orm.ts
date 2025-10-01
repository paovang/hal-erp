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
import { CurrencyOrmEntity } from './currency.orm';

// @Unique(['from_currency_id', 'to_currency_id'])
@Entity('exchange_rates')
export class ExchangeRateOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;
  // ----- From Currency -----
  @Index()
  @Column({ type: 'bigint' })
  from_currency_id: number;

  @ManyToOne(() => CurrencyOrmEntity, (currency) => currency.exchange_rate_from)
  @JoinColumn({ name: 'from_currency_id' })
  from_currency: Relation<CurrencyOrmEntity>;

  // ----- To Currency -----
  @Index()
  @Column({ type: 'bigint' })
  to_currency_id: number;

  @ManyToOne(() => CurrencyOrmEntity, (currency) => currency.exchange_rate_to)
  @JoinColumn({ name: 'to_currency_id' })
  to_currency: Relation<CurrencyOrmEntity>;

  // ----- Rate -----
  @Index()
  @Column({ type: 'decimal', precision: 15, scale: 8 })
  rate: number;

  // ----- Status -----
  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  // ----- Timestamps -----
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
