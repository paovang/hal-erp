import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

export interface UserContext {
  auth?: {
    user: any;
    roles: string[];
    profile?: any;
    departmentUser: {
      id: number;
      departments?: any[];
    };
    permissions?: string[];
  };
  [key: symbol]: unknown; // Add index signature for symbol
}

@Injectable()
export class UserContextService {
  constructor(private readonly cls: ClsService<UserContext>) {}

  setAuthUser(req: any) {
    this.cls.set('auth', req.enhancedUser);
  }

  getAuthUser() {
    return this.cls.get('auth');
  }
}
