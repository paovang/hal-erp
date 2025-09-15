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
        'user_signatures',
        'department_users',
        'department_users.departments',
      ],
    });
    const fullUserType = await this.userRepository.findOne({
      where: { id: result.user.id },
      relations: ['user_types', 'user_types.user'],
    });

    // Step 3: Extract permissions and role names
    const permissions =
      fullUser?.userHasPermissions?.map((uhp) => uhp.permission?.name) ?? [];

    const roleNames = fullUser?.roles?.map((role) => role.name) ?? [];
    const userType = fullUserType?.user_types?.map((type) => type.name) ?? [];
    // const user_signature =
    //   fullUser?.user_signatures?.[0]?.signature_file ?? null;
    const signature = fullUser?.user_signatures?.[0]?.signature_file
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${fullUser.user_signatures[0].signature_file}`
      : '';
    const department_name =
      fullUser?.department_users?.[0]?.departments?.name ?? null;

    const userWithoutPermissions: any = { ...(fullUser ?? {}) };
    if (
      userWithoutPermissions &&
      'userHasPermissions' in userWithoutPermissions
    ) {
      delete userWithoutPermissions.userHasPermissions;
    }
    if (userWithoutPermissions && 'user_signatures' in userWithoutPermissions) {
      delete userWithoutPermissions.user_signatures;
    }
    if (
      userWithoutPermissions &&
      'department_users' in userWithoutPermissions
    ) {
      delete userWithoutPermissions.department_users;
    }

    return {
      access_token: result.access_token,
      user: {
        ...userWithoutPermissions,
        permission: permissions,
        roles: roleNames,
        user_type: userType,
        department_name,
        signature,
      },
    };
  }

  // push on server
}
