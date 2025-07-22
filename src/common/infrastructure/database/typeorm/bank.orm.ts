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

@Entity('banks')
export class BankOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  short_name?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

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
    (vendor_bank_accounts) => vendor_bank_accounts.banks,
  )
  vendor_bank_accounts: Relation<VendorBankAccountOrmEntity[]>;
}
