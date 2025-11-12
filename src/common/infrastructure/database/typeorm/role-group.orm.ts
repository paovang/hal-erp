import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DepartmentOrmEntity } from './department.orm';
import { RoleOrmEntity } from './role.orm';

@Entity('roles_groups')
export class RoleGroupOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @PrimaryColumn({ name: 'role_id', type: 'bigint', unsigned: true })
  role_id: number;
  @ManyToOne(() => RoleOrmEntity, (role) => role.rolesGroups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleOrmEntity;

  @PrimaryColumn({ name: 'department_id', type: 'bigint', unsigned: true })
  department_id: number;
  @ManyToOne(
    () => DepartmentOrmEntity,
    (department) => department.rolesGroups,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'department_id' })
  department: DepartmentOrmEntity;

  // @Column({
  //   type: 'bigint',
  //   unsigned: true,
  //   nullable: true,
  // })
  // company_id?: number;
  // @ManyToOne(() => CompanyOrmEntity, (company) => company.rolesGroups, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({ name: 'company_id' })
  // company: Relation<CompanyOrmEntity>;
}
