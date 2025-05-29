import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { DEPARTMENT_APPLICATION_SERVICE } from '@src/modules/manage/application/constants/inject-key.const';
import { DepartmentQueryDto } from '@src/modules/manage/application/dto/query/department-query.dto';
import { IDepartmentServiceInterface } from '@src/modules/manage/domain/ports/input/department-domain-service.interface';
import { DepartmentResponse } from '@src/modules/manage/application/dto/response/department.response';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import {
  PROFILE_IMAGE_ALLOW_MIME_TYPE,
  TRANSFORM_RESULT_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { DepartmentDataMapper } from '@src/modules/manage/application/mappers/department.mapper';
import { CreateDepartmentDto } from '@src/modules/manage/application/dto/create/department/create.dto';
import { UpdateDepartmentDto } from '@src/modules/manage/application/dto/create/department/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from '@common/interceptors/file/file.interceptor';
import { FileMimeTypeValidator } from '@common/validations/file-mime-type.validator';
import { FileSizeValidator } from '@common/validations/file-size.validator';
import { AMAZON_S3_SERVICE_KEY } from '@common/infrastructure/aws3/config/inject-key';
import { USER_PROFILE_IMAGE_FOLDER } from '../application/constants/inject-key.const';
import { Public } from '@core-system/auth';
import { IImageOptimizeService } from '@common/utils/services/images/interface/image-optimize-service.interface';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
// import { AuthUser } from '@core-system/auth';

@Controller('department')
export class DepartmentController {
  constructor(
    @Inject(DEPARTMENT_APPLICATION_SERVICE)
    private readonly _departmentService: IDepartmentServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: DepartmentDataMapper,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  /** Get All */
  // @Public()
  @Get('')
  async getAll(
    @Query() dto: DepartmentQueryDto,
    // @AuthUser() auth: any,
  ): Promise<ResponseResult<DepartmentResponse>> {
    // console.log('user:', auth.departmentUser.departments);
    const result = await this._departmentService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  /** Get One */
  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<DepartmentResponse>> {
    const result = await this._departmentService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  /** Create */
  @Public()
  @Post('')
  async create(
    @Body() dto: CreateDepartmentDto,
  ): Promise<ResponseResult<DepartmentResponse>> {
    const result = await this._departmentService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  /** Update */
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDepartmentDto,
  ): Promise<ResponseResult<DepartmentResponse>> {
    const result = await this._departmentService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  /** Delete */
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._departmentService.delete(id);
  }

  @Public()
  @Post('/profile-image')
  @UseInterceptors(
    FileInterceptor('profile_image'),
    new FileValidationInterceptor(
      new FileMimeTypeValidator([...PROFILE_IMAGE_ALLOW_MIME_TYPE]),
      new FileSizeValidator(5 * 1024 * 1024),
      'profile_image',
    ),
  )
  async changeProfileImage(@Body() changeProfileImageDto: any) {
    const optimizedImageProfile = await this._optimizeService.optimizeImage(
      changeProfileImageDto.profile_image,
    );

    const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
      optimizedImageProfile,
      USER_PROFILE_IMAGE_FOLDER,
    );

    console.log('changeProfileImageDto:', s3ImageResponse);
  }
}
