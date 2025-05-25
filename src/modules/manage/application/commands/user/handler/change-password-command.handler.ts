import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ChangePasswordCommand } from '../change-password.command';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { WRITE_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { BadRequestException, Inject } from '@nestjs/common';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import * as bcrypt from 'bcrypt';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordCommandHandler
  implements IQueryHandler<ChangePasswordCommand, ResponseResult<UserEntity>>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
    private readonly _dataMapper: UserDataMapper,
  ) {}
  async execute(query: ChangePasswordCommand): Promise<any> {
    if (isNaN(query.id)) {
      throw new BadRequestException('ID must be a number');
    }

    const user = await findOneOrFail(query.manager, UserOrmEntity, {
      id: query.id,
    });

    const password = (user as any).password;

    // Compare input old password with stored hashed password
    const isMatch = await bcrypt.compare(query.dto.old_password, password);
    if (!isMatch) {
      throw new BadRequestException('Old password is not correct');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(query.dto.new_password, 10);
    query.dto.new_password = hashedPassword;

    // Map to entity
    const entity = this._dataMapper.toEntityForChangePassword(query.dto);

    // Set and validate ID
    await entity.initializeUpdateSetId(new UserId(query.id));
    await entity.validateExistingIdForUpdate();

    return this._write.changePassword(entity, query.manager);
  }
}
