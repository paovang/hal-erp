import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserEnhancementInterceptor implements NestInterceptor {
  constructor() {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const authUser = request.user;
    request.enhancedUser = {
      ...authUser,
      departmentUser: {
        id: 1,
        name: 'alex',
      },
    };
    console.log('authUser: ', authUser);

    return next.handle();
  }
}
