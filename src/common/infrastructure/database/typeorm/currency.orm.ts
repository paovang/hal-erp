import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { VendorBankAccountOrmEntity } from './vendor_bank_account.orm';
import { ExchangeRateOrmEntity } from './exchange-rate.orm';

@Entity('currencies')
export class CurrencyOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  code: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => VendorBankAccountOrmEntity,
    (vendor_bank_accounts) => vendor_bank_accounts.currencies,
  )
  vendor_bank_accounts: Relation<VendorBankAccountOrmEntity[]>;
  @OneToMany(
    () => ExchangeRateOrmEntity,
    (exchage_rate) => exchage_rate.from_currency,
  )
  exchange_rate_from: Relation<ExchangeRateOrmEntity[]>;
  @OneToMany(
    () => ExchangeRateOrmEntity,
    (exchage_rate) => exchage_rate.to_currency,
  )
  exchange_rate_to: Relation<ExchangeRateOrmEntity[]>;
}
