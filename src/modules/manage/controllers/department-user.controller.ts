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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import {
  PROFILE_IMAGE_ALLOW_MIME_TYPE,
  TRANSFORM_RESULT_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { DEPARTMENT_USER_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { CreateDepartmentUserDto } from '../application/dto/create/departmentUser/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { IDepartmentUserServiceInterface } from '../domain/ports/input/department-user-domain-service.interface';
import { DepartmentUserDataMapper } from '../application/mappers/department-user.mapper';
import { DepartmentUserResponse } from '../application/dto/response/department-user.response';
import { UpdateDepartmentUserDto } from '../application/dto/create/departmentUser/update.dto';
import { DepartmentUserQueryDto } from '../application/dto/query/department-user-query.dto';
import { UploadFileDto } from '../application/dto/create/departmentUser/upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { Public } from '@core-system/auth';
import { FileValidationInterceptor } from '@src/common/interceptors/file/file.interceptor';
import { FileMimeTypeValidator } from '@src/common/validations/file-mime-type.validator';
import { FileSizeValidator } from '@src/common/validations/file-size.validator';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
// import { Request } from 'express';

@Controller('department-users')
export class DepartmentUserController {
  constructor(
    @Inject(DEPARTMENT_USER_APPLICATION_SERVICE)
    private readonly _departmentUserService: IDepartmentUserServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: DepartmentUserDataMapper,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  @Public()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './assets/uploads',
        filename: (
          req: Express.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          const now = new Date();
          const fileName =
            now.getFullYear().toString() +
            '-' +
            (now.getMonth() + 1).toString().padStart(2, '0') +
            '-' +
            now.getDate().toString().padStart(2, '0') +
            '-' +
            Date.now() +
            path.extname(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(
    @Body() body: UploadFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    return {
      file: file.filename,
    };
  }

  @Public()
  @Post('')
  @UseInterceptors(
    FileInterceptor('signatureFile'),
    new FileValidationInterceptor(
      new FileMimeTypeValidator([...PROFILE_IMAGE_ALLOW_MIME_TYPE]),
      new FileSizeValidator(5 * 1024 * 1024),
      'signatureFile',
    ),
  )
  async create(
    @Body()
    dto: CreateDepartmentUserDto,
    @UploadedFile() signatureFile: Express.Multer.File,
  ): Promise<ResponseResult<DepartmentUserResponse>> {
    dto.signatureFile = signatureFile;
    const result = await this._departmentUserService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  // @Public()
  @Get('')
  async getAll(
    @Query() dto: DepartmentUserQueryDto,
  ): Promise<ResponseResult<DepartmentUserResponse>> {
    const result = await this._departmentUserService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  /** Get One */
  // @Public()
  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<DepartmentUserResponse>> {
    const result = await this._departmentUserService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  /** Update */
  @Public()
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('signatureFile'),
    new FileValidationInterceptor(
      new FileMimeTypeValidator([...PROFILE_IMAGE_ALLOW_MIME_TYPE]),
      new FileSizeValidator(5 * 1024 * 1024),
      'signatureFile',
    ),
  )
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDepartmentUserDto,
    @UploadedFile() signatureFile: Express.Multer.File,
  ): Promise<ResponseResult<DepartmentUserResponse>> {
    dto.signatureFile = signatureFile;
    const result = await this._departmentUserService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._departmentUserService.delete(id);
  }
}
