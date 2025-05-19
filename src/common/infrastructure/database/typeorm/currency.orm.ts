import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}