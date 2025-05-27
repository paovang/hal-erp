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
import { VendorOrmEntity } from './vendor.orm';
import { CurrencyOrmEntity } from './currency.orm';

@Entity('vendor_bank_accounts')
export class VendorBankAccountOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ nullable: true })
  vendor_id?: number;
  @ManyToOne(() => VendorOrmEntity, (vendors) => vendors.vendor_bank_accounts)
  @JoinColumn({ name: 'vendor_id' })
  vendors: Relation<VendorOrmEntity>;

  @Index()
  @Column({ nullable: true })
  currency_id?: number;
  @ManyToOne(
    () => CurrencyOrmEntity,
    (currencies) => currencies.vendor_bank_accounts,
  )
  @JoinColumn({ name: 'currency_id' })
  currencies: Relation<CurrencyOrmEntity>;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  bank_name: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  account_name: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  account_number: string;

  @Index()
  @Column({ type: 'boolean', default: false })
  is_selected: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
