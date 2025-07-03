import { SetMetadata } from '@nestjs/common';
import { PermissionName } from '../enums/permission.enum';

export const PERMISSION_KEY = Symbol('PERMISSION_KEY');
export const Permissions = (...permissions: PermissionName[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
