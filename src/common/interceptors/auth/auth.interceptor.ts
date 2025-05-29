import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { UserContextService } from '@src/common/utils/services/cls/cls.service';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(DepartmentUserOrmEntity)
    private readonly departmentUserRepository: Repository<DepartmentUserOrmEntity>,
    private readonly _userContextService: UserContextService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const authUser = request.user;

    if (authUser) {
      const departmentUser = await this.departmentUserRepository.findOne({
        where: { user_id: authUser.id },
        relations: ['departments'],
      });

      request.enhancedUser = {
        user: authUser,
        departmentUser: departmentUser,
      };

      this._userContextService.setAuthUser(request);
    }

    return next.handle();
  }
}
