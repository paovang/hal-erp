import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';

export interface ITransformResultService {
  execute<Entity extends object, Response>(
    transformFn: (entity: Entity) => Response,
    result?: ResponseResult<Entity>,
  ): ResponseResult<Response>;
}
