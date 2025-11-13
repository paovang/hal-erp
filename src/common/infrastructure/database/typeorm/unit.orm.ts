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
import { PurchaseRequestItemOrmEntity } from './purchase-request-item.orm';
import { ProductOrmEntity } from './product.orm';

@Entity('units')
export class UnitOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => PurchaseRequestItemOrmEntity,
    (purchase_request_items) => purchase_request_items.units,
  )
  purchase_request_items: Relation<PurchaseRequestItemOrmEntity[]>;

  @OneToMany(() => ProductOrmEntity, (products) => products.unit)
  products: Relation<ProductOrmEntity[]>;
}
