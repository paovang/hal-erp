import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { RoleOrmEntity } from "./role.orm";

@Entity('permissions')
export class PermissionOrmEntity {
    @PrimaryGeneratedColumn({ unsigned: true })
    id!: number;

    @Index()
    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    display_name!: string;

    @Index()
    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToMany(() => RoleOrmEntity, (role) => role.permissions, {
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
    })
    roles: Relation<RoleOrmEntity[]>;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  
    @UpdateDateColumn({
        type: 'timestamp',
    })
    updated_at: Date;
  
    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date | null;
}