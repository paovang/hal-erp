import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { IReadDepartmentUserRepository } from '@src/modules/manage/domain/ports/output/department-user-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { DepartmentUserDataAccessMapper } from '../../mappers/department-user.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentUserQueryDto } from '@src/modules/manage/application/dto/query/department-user-query.dto';
import { DepartmentUserEntity } from '@src/modules/manage/domain/entities/department-user.entity';
import { DepartmentUserId } from '@src/modules/manage/domain/value-objects/department-user-id.vo';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';

@Injectable()
export class ReadDepartmentUserRepository
  implements IReadDepartmentUserRepository
{
  constructor(
    @InjectRepository(DepartmentUserOrmEntity)
    private readonly _departmentUserOrm: Repository<DepartmentUserOrmEntity>,
    private readonly _dataAccessMapper: DepartmentUserDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: DepartmentUserQueryDto,
    manager: EntityManager,
    departmentId?: number | null,
    company_id?: number,
    roles?: string[],
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    const queryBuilder = await this.createBaseQuery(
      manager,
      departmentId,
      query.type,
      company_id,
      roles,
    );

    query.sort_by = 'department_users.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(
    manager: EntityManager,
    departmentId?: number | null,
    type?: string,
    company_id?: number,
    roles?: string[],
  ) {
    const qb = manager
      .createQueryBuilder(DepartmentUserOrmEntity, 'department_users')
      .leftJoin('department_users.company', 'company')
      .leftJoin('department_users.departments', 'departments')
      .leftJoin('department_users.users', 'users')
      .leftJoin('department_users.line_manager', 'line_manager')
      .leftJoin('users.user_signatures', 'user_signatures')
      .leftJoin('users.userHasPermissions', 'user_has_permissions')
      .leftJoinAndSelect('users.user_types', 'user_types')
      .leftJoin('user_has_permissions.permission', 'permissions')
      .leftJoin('department_users.positions', 'positions')
      .leftJoin('users.roles', 'roles')
      .leftJoin('roles.permissions', 'role_permissions')
      .addSelect([
        'departments.id',
        'departments.name',
        'departments.code',
        'users.id',
        'users.username',
        'users.email',
        'users.tel',
        'user_has_permissions.user_id',
        'user_has_permissions.permission_id',
        'permissions.id',
        'permissions.name',
        'positions.id',
        'positions.name',
        'roles.id',
        'roles.name',
        'role_permissions.id',
        'role_permissions.name',
        'user_signatures.id',
        'user_signatures.signature_file',
        'line_manager.id',
        'line_manager.username',
        'line_manager.email',
        'line_manager.tel',
        'company.id',
        'company.name',
        'company.email',
        'company.tel',
        'company.logo',

        // 'user_types.name',
        // 'user_types.user_id',
      ]);

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      if (
        roles.includes(EligiblePersons.COMPANY_ADMIN) ||
        roles.includes(EligiblePersons.COMPANY_USER)
      ) {
        if (company_id) {
          qb.andWhere('department_users.company_id = :company_id', {
            company_id,
          });
        }
      }
      if (departmentId && departmentId != null) {
        qb.andWhere('department_users.department_id = :departmentId', {
          departmentId,
        });
      }
    }

    if (departmentId && type === 'approvers') {
      qb.andWhere(
        `NOT EXISTS (
      SELECT 1
      FROM department_approvers da
      WHERE da.user_id = department_users.user_id
        AND da.department_id = :departmentId
        AND da.deleted_at IS NULL
    )`,
        { departmentId },
      );
    } else if (departmentId && type === 'approval_rules') {
      qb.andWhere(
        `NOT EXISTS (
      SELECT 1
      FROM budget_approval_rules bar
      WHERE bar.approver_id = department_users.user_id
        AND bar.department_id = :departmentId
        AND bar.deleted_at IS NULL
    )`,
        { departmentId },
      );
    }

    return qb;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [
        'users.username',
        'users.email',
        'users.tel',
        'departments.name',
      ],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: DepartmentUserId,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('department_users.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
  async findAllByDepartment(
    department_id: DepartmentId,
    manager: EntityManager,
  ): Promise<DepartmentUserEntity[]> {
    const items = await this.createBaseQuery(manager)
      .where('department_users.department_id = :department_id', {
        department_id: department_id.value,
      })
      .getMany();

    return items.map((item) => this._dataAccessMapper.toEntity(item));
  }
}
