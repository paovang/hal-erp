import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, switchMap } from 'rxjs';
import {
  ApiResponse,
  BaseApiCursorPaginatedResponse,
  BaseApiPaginatedResponse,
  BaseApiResponse,
} from '@common/validations/dto/response.dto';
import {
  CursorPaginatedResponseData,
  PaginatedResponseData,
  ResponseDataType,
  StandardResponseData,
} from '@common/application/interfaces/response.inteface';
import { LOCALIZATION_SERVICE } from '@common/constants/inject-key.const';
import { ILocalizationService } from '@common/infrastructure/localization/interface/localization.interface';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(
    @Inject(LOCALIZATION_SERVICE)
    private readonly localizationService: ILocalizationService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next
      .handle()
      .pipe(
        switchMap((data) =>
          from(this.buildResponse(context, data as ResponseDataType<T>)),
        ),
      );
  }

  private async buildResponse(
    context: ExecutionContext,
    data: ResponseDataType<T>,
  ): Promise<ApiResponse<T>> {
    const statusCode = this.determineStatus(context);
    const message = await this.localizationService
      .translate('success.general')
      .catch(() => 'Success');

    if (this.isPaginatedResponseData(data)) {
      return this.buildPaginatedResponse(data, message, statusCode);
    } else if (this.isCursorPaginatedResponseData(data)) {
      return this.buildCursorPaginatedResponse(data, message, statusCode);
    } else {
      return this.buildStandardResponse(data, message, statusCode);
    }
  }

  private isPaginatedResponseData(
    data: ResponseDataType<T>,
  ): data is PaginatedResponseData<T> {
    return (
      data !== null &&
      typeof data === 'object' &&
      'pagination' in data &&
      typeof data.pagination === 'object' &&
      'total' in data.pagination
    );
  }

  private isCursorPaginatedResponseData(
    data: ResponseDataType<T>,
  ): data is CursorPaginatedResponseData<T> {
    return (
      data !== null &&
      typeof data === 'object' &&
      'pagination' in data &&
      typeof data.pagination === 'object' &&
      ('next_cursor' in data.pagination || 'previous_cursor' in data.pagination)
    );
  }

  private buildStandardResponse(
    data: StandardResponseData<T>,
    message: string,
    statusCode: HttpStatus,
  ): BaseApiResponse<T> {
    return {
      status_code: statusCode,
      message,
      data: data as T,
    };
  }

  private buildPaginatedResponse(
    data: PaginatedResponseData<T>,
    message: string,
    statusCode: HttpStatus,
  ): BaseApiPaginatedResponse<T> {
    return {
      status_code: statusCode,
      message,
      data: data.data,
      pagination: data.pagination,
    };
  }

  private buildCursorPaginatedResponse(
    data: CursorPaginatedResponseData<T>,
    message: string,
    statusCode: HttpStatus,
  ): BaseApiCursorPaginatedResponse<T> {
    return {
      status_code: statusCode,
      message,
      data: data.data,
      pagination: data.pagination,
    };
  }

  private determineStatus(context: ExecutionContext): HttpStatus {
    const method = context.switchToHttp().getRequest().method;
    switch (method) {
      case 'POST':
        return HttpStatus.CREATED;
      case 'DELETE':
        return HttpStatus.NO_CONTENT;
      default:
        return HttpStatus.OK;
    }
  }
}
