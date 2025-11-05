import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { PositionEntity } from '@src/modules/manage/domain/entities/position.entity';
import { WRITE_POSITION_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWritePositionRepository } from '@src/modules/manage/domain/ports/output/position-repository.interface';
import { PositionDataMapper } from '../../../mappers/position.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PositionOrmEntity } from '@src/common/infrastructure/database/typeorm/position.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { PositionId } from '@src/modules/manage/domain/value-objects/position-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { EligiblePersons } from '../../../constants/status-key.const';
import { IsNull, Not } from 'typeorm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<PositionEntity>>
{
  constructor(
    @Inject(WRITE_POSITION_REPOSITORY)
    private readonly _write: IWritePositionRepository,
    private readonly _dataMapper: PositionDataMapper,
    private readonly _userContextService: UserContextService,
  ) {}
  async execute(query: UpdateCommand): Promise<any> {
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
          id: Not(query.id),
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
        query.id,
        company_id,
      );
    }

    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(query.manager, PositionOrmEntity, {
      id: query.id,
    });

    // Map to entity
    const entity = this._dataMapper.toEntity(query.dto);

    // Set and validate ID
    await entity.initializeUpdateSetId(new PositionId(query.id));
    await entity.validateExistingIdForUpdate();

    // Final existence check for ID before update
    await findOneOrFail(query.manager, PositionOrmEntity, {
      id: entity.getId().value,
    });

    return this._write.update(entity, query.manager);
  }
}
