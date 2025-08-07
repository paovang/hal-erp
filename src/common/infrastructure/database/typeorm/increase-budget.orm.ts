import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { BudgetAccountOrmEntity } from './budget-account.orm';
import { UserOrmEntity } from './user.orm';
import { IncreaseBudgetFileOrmEntity } from './increase-budget-file.orm';

@Entity('increase_budgets')
export class IncreaseBudgetOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ nullable: true })
  budget_account_id?: number;
  @ManyToOne(
    () => BudgetAccountOrmEntity,
    (budget_account) => budget_account.increase_budgets,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'budget_account_id' })
  budget_account: Relation<BudgetAccountOrmEntity>;

  @Index()
  @Column({ type: 'double precision', nullable: true })
  allocated_amount?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Index()
  @Column({ type: 'date', nullable: true })
  import_date?: Date;

  @Index()
  @Column({ nullable: true })
  created_by?: number;
  @ManyToOne(() => UserOrmEntity, (users) => users.increase_budgets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  users: Relation<UserOrmEntity>;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => IncreaseBudgetFileOrmEntity,
    (increase_budget_files) => increase_budget_files.increase_budget,
  )
  increase_budget_files: Relation<IncreaseBudgetFileOrmEntity[]>;
}
