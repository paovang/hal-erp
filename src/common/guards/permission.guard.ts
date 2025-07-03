import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { PERMISSION_KEY } from '../decorators/permission.decorator';
import { UserOrmEntity } from '../infrastructure/database/typeorm/user.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { PermissionName } from '../enums/permission.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionName[]
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserOrmEntity;

    if (!user) {
      throw new ManageDomainException('errors.not_found', HttpStatus.NOT_FOUND);
    }

    const permissions = await this.loadAllUserPermissionNames(user.id);

    // ✅ เช็คสิทธิ์ด้วย Set (เร็วกว่า Array)
    const userPermissionsSet = new Set(permissions);

    const hasPermission = requiredPermissions.some((required) =>
      userPermissionsSet.has(required),
    );

    if (!hasPermission) {
      throw new ManageDomainException(
        'errors.forbidden_resource',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }

  /**
   * Load all permissions the user has (from roles & direct userHasPermissions)
   */
  private async loadAllUserPermissionNames(userId: number): Promise<string[]> {
    const result = await this.dataSource
      .getRepository(UserOrmEntity)
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'roles')
      .leftJoin('roles.permissions', 'rolePermissions')
      .leftJoin('user.userHasPermissions', 'userHasPermissions')
      .leftJoin('userHasPermissions.permission', 'directPermissions')
      .where('user.id = :id', { id: userId })
      .select([])
      .addSelect('roles.name', 'roleName')
      .addSelect('rolePermissions.name', 'rolePermission')
      .addSelect('directPermissions.name', 'directPermission')
      .getRawMany();

    const rolePermissions = result
      .map((row) => row.rolePermission)
      .filter(Boolean);
    const directPermissions = result
      .map((row) => row.directPermission)
      .filter(Boolean);

    const all = [...rolePermissions, ...directPermissions];

    // ✅ เอาเฉพาะค่าไม่ซ้ำ
    return Array.from(new Set(all));
  }
}
