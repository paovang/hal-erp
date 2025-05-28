import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { WRITE_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { SendMailCommand } from '../send-mail.command';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { generateNumericCode } from '@src/common/utils/code-generator';

@CommandHandler(SendMailCommand)
export class SendMailCommandHandler
  implements IQueryHandler<SendMailCommand, ResponseResult<UserEntity>>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
    private readonly _dataMapper: UserDataMapper,
  ) {}
  async execute(query: SendMailCommand): Promise<ResponseResult<UserEntity>> {
    await findOneOrFail(query.manager, UserOrmEntity, {
      email: query.dto.email,
    });

    const code = generateNumericCode(6); // e.g., "928471"

    const merge_data = {
      ...query.dto,
      code,
    };

    // Map to entity
    const entity = this._dataMapper.toEntitySendEmail(merge_data);

    return await this._write.sendMail(entity, query.manager);
  }
}
