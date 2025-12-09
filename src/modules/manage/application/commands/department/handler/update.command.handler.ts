import { IQueryHandler, CommandHandler } from '@nestjs/cqrs';
import { WRITE_DEPARTMENT_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { IWriteDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentDataMapper } from '@src/modules/manage/application/mappers/department.mapper';
import { UpdateCommand } from '@src/modules/manage/application/commands/department/update.command';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { EligiblePersons } from '../../../constants/status-key.const';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { IsNull, Not } from 'typeorm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<DepartmentEntity>>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_REPOSITORY)
    private readonly _write: IWriteDepartmentRepository,
    private readonly _dataMapper: DepartmentDataMapper,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: UpdateCommand): Promise<any> {
    let isLineManager: boolean;
    let company_id: number | null | undefined = null;
    const user = this._userContextService.getAuthUser()?.user;
    const user_id = user.id;
    const roles = user?.roles?.map((r: any) => r.name) ?? [];

    if (
      roles.includes(EligiblePersons.SUPER_ADMIN) ||
      roles.includes(EligiblePersons.ADMIN)
    ) {
      const check_code = await query.manager.findOne(DepartmentOrmEntity, {
        where: {
          id: Not(query.id),
          code: query.dto.code,
          company_id: IsNull(),
        },
      });

      if (check_code)
        throw new ManageDomainException(
          'errors.code_already_exists',
          HttpStatus.BAD_REQUEST,
          { property: `${query.dto.code}` },
        );
    } else if (
      roles.includes(EligiblePersons.COMPANY_USER) ||
      roles.includes(EligiblePersons.COMPANY_ADMIN)
    ) {
      const company_user = await findOneOrFail(
        query.manager,
        CompanyUserOrmEntity,
        {
          user_id: user_id,
        },
        `company user id ${user_id}`,
      );

      company_id = company_user.company_id;
      if (!company_id)
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.NOT_FOUND,
          { property: `${company_id}` },
        );

      const check_code = await query.manager.findOne(DepartmentOrmEntity, {
        where: {
          id: Not(query.id),
          code: query.dto.code,
          company_id: company_id,
        },
      });

      if (check_code)
        throw new ManageDomainException(
          'errors.code_already_exists',
          HttpStatus.BAD_REQUEST,
          { property: `${query.dto.code}` },
        );
    } else {
      throw new ManageDomainException('errors.forbidden', HttpStatus.FORBIDDEN);
    }

    if (
      query.dto.department_head_id &&
      query.dto.department_head_id > 0 &&
      query.dto.department_head_id != null
    ) {
      isLineManager = false;
      await findOneOrFail(
        query.manager,
        UserOrmEntity,
        {
          id: query.dto.department_head_id,
        },
        `department head ${query.dto.department_head_id}`,
      );
    } else {
      isLineManager = true;
    }

    await findOneOrFail(
      query.manager,
      UserOrmEntity,
      {
        id: query.dto.department_head_id,
      },
      'department head',
    );

    const entity = this._dataMapper.toEntity(
      query.dto,
      isLineManager,
      undefined,
      company_id || undefined,
    );
    await entity.initializeUpdateSetId(new DepartmentId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department ById */
    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
  }
}
