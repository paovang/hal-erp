import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { PositionEntity } from '@src/modules/manage/domain/entities/position.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_POSITION_REPOSITORY } from '../../../constants/inject-key.const';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { PositionOrmEntity } from '@src/common/infrastructure/database/typeorm/position.orm';
import { IWritePositionRepository } from '@src/modules/manage/domain/ports/output/position-repository.interface';
import { PositionDataMapper } from '../../../mappers/position.mapper';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { EligiblePersons } from '../../../constants/status-key.const';
import { IsNull } from 'typeorm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<PositionEntity>>
{
  constructor(
    @Inject(WRITE_POSITION_REPOSITORY)
    private readonly _write: IWritePositionRepository,
    private readonly _dataMapper: PositionDataMapper,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: CreateCommand): Promise<ResponseResult<PositionEntity>> {
    const user = this._userContextService.getAuthUser()?.user;
    const user_id = user.id;
    let company_id: number | null | undefined = null;

    const roles = user?.roles?.map((r: any) => r.name) ?? [];

    if (
      roles.includes(EligiblePersons.SUPER_ADMIN) ||
      roles.includes(EligiblePersons.ADMIN)
    ) {
      const position = await query.manager.findOne(PositionOrmEntity, {
        where: {
          name: query.dto.name,
          company_id: IsNull(),
        },
      });

      if (position)
        throw new ManageDomainException(
          'errors.name_already_exists',
          HttpStatus.NOT_FOUND,
          { property: `${query.dto.name}` },
        );
    } else {
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

      await _checkColumnDuplicate(
        PositionOrmEntity,
        'name',
        query.dto.name,
        query.manager,
        'errors.name_already_exists',
        undefined,
        company_id,
      );
    }

    const entity = this._dataMapper.toEntity(
      query.dto,
      company_id || undefined,
    );

    return await this._write.create(entity, query.manager);
  }
}
