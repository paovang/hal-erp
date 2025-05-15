import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { DomainException } from '@src/common/domain/exceptions/domain.exception';

@Injectable()
export class TransformResultService implements ITransformResultService {
  execute<Entity extends object, Response>(
    mapper: (entity: Entity) => Response,
    result?: ResponseResult<Entity>,
  ): ResponseResult<Response> {
    if (!result) {
      throw new DomainException(
        'domain.record_not_found',
        HttpStatus.NOT_FOUND,
      );
    }
    if ('data' in result && Array.isArray(result.data)) {
      return {
        ...result,
        data: result.data.map(mapper),
      };
    } else if (Array.isArray(result)) {
      return result.map(mapper);
    } else if (result !== null) {
      return mapper(result as Entity);
    } else {
      throw new DomainException(
        'domain.record_not_found',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
