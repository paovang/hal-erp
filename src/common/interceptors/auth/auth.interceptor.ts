import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentUserOrmEntity } from '@common/infrastructure/database/typeorm/department-user.orm';
import { UserContextService } from '@common/infrastructure/cls/cls.service';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(DepartmentUserOrmEntity)
    private readonly departmentUserRepository: Repository<DepartmentUserOrmEntity>,
    private readonly _userContextService: UserContextService,
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const authUser = request.user;

    if (authUser) {
      const fullUser = await this.userRepository.findOne({
        where: { id: authUser.id },
        relations: ['roles'],
      });

      const hasAdminRole = fullUser?.roles?.some(
        (role) => role.name === 'admin' || role.name === 'super-admin',
      );

      let departmentUser = null;

      if (!hasAdminRole) {
        departmentUser = await this.departmentUserRepository.findOne({
          where: { user_id: authUser.id },
          relations: ['departments'],
        });
      }

      request.enhancedUser = {
        user: fullUser,
        departmentUser: departmentUser ?? { departments: [] },
      };

      this._userContextService.setAuthUser(request);
    }

    return next.handle();
  }
}
