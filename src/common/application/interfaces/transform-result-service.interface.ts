import { ResponseResult } from './pagination.interface';

export interface ITransformResultService {
  execute<Entity extends object, Response>(
    transformFn: (entity: Entity) => Response,
    result?: ResponseResult<Entity>,
  ): ResponseResult<Response>;
}
