import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('seeder_logs')
export class SeederLogOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;
}
