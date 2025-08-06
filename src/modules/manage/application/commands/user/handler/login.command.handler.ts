import { LoginCommand } from '../login.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { AuthService } from '@core-system/auth';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@CommandHandler(LoginCommand)
export class LoginCommandHandler
  implements IQueryHandler<LoginCommand, ResponseResult<any>>
{
  constructor(
    private readonly _authService: AuthService,
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async execute(query: LoginCommand): Promise<any> {
    const result = await this._authService.validateUser(query.dto);

    const fullUser = await this.userRepository.findOne({
      where: { id: result.user.id },
      relations: [
        'roles',
        'roles.permissions',
        'userHasPermissions.permission',
      ],
    });

    // Step 3: Extract permissions and role names
    const permissions =
      fullUser?.userHasPermissions?.map((uhp) => uhp.permission?.name) ?? [];

    const roleNames = fullUser?.roles?.map((role) => role.name) ?? [];

    const { userHasPermissions, ...userWithoutPermissions } = fullUser ?? {};

    return {
      access_token: result.access_token,
      user: {
        ...userWithoutPermissions,
        permission: permissions,
        roles: roleNames,
      },
    };
  }

  // push on server
}
