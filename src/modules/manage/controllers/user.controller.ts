import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import {
  MAX_DOCUMENT_SIZE,
  USER_APPLICATION_SERVICE,
} from '../application/constants/inject-key.const';
import { IUserServiceInterface } from '../domain/ports/input/user-domain-service.interface';
import { UserDataMapper } from '../application/mappers/user.mapper';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CreateUserDto } from '../application/dto/create/user/create.dto';
import { UserResponse } from '../application/dto/response/user.response';
import { UserQueryDto } from '../application/dto/query/user-query.dto';
import { UpdateUserDto } from '../application/dto/create/user/update.dto';
import { ChangePasswordDto } from '../application/dto/create/user/change-password.dto';
import { SendMailDto } from '../application/dto/create/user/send-email.dto';
import { AuthService, Public } from '@core-system/auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from '@src/common/interceptors/file/file.interceptor';
import { FileMimeTypeValidator } from '@src/common/validations/file-mime-type.validator';
import { FileSizeValidator } from '@src/common/validations/file-size.validator';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { multerStorage } from '@src/common/utils/multer.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { verifyHashData } from '@src/common/utils/server/hash-data.util';
import { ManageDomainException } from '../domain/exceptions/manage-domain.exception';

@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_APPLICATION_SERVICE)
    private readonly _userService: IUserServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: UserDataMapper,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
    private readonly _authService: AuthService,
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() dto: any): Promise<any> {
    return await this._userService.login(dto);

    // const result = await this._authService.validateUser(dto);
  }

  @Public()
  @Post('')
  async create(
    @Body() dto: CreateUserDto,
  ): Promise<ResponseResult<UserResponse>> {
    const result = await this._userService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerStorage,
    }),
    new FileValidationInterceptor(
      new FileMimeTypeValidator(PROFILE_IMAGE_ALLOW_MIME_TYPE),
      new FileSizeValidator(MAX_DOCUMENT_SIZE),
      'image',
    ),
  )
  async changeProfileImage(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
    };
  }

  // @Permissions(PermissionName.READ_USER)
  @Get('')
  async getAll(
    @Query() dto: UserQueryDto,
  ): Promise<ResponseResult<UserResponse>> {
    const result = await this._userService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ResponseResult<UserResponse>> {
    const result = await this._userService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Get('by-token/:token')
  async verifyOTP(
    // @Query() token_dto: TokenDto,
    @Param('token') token: string,
  ): Promise<ResponseResult<UserResponse>> {
    const verify = await verifyHashData(token);
    if (!verify) {
      throw new ManageDomainException(
        'errors.invalid_token',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log('verify', verify);
    const id = verify.user_id;

    const result = await this._userService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponseResult<UserResponse>> {
    const result = await this._userService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put('/change-password/:id')
  async changePassword(
    @Param('id') id: number,
    @Body() dto: ChangePasswordDto,
  ): Promise<ResponseResult<UserResponse>> {
    const result = await this._userService.changePassword(id, dto);
    console.log('result', result);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Post('send-mail')
  async sendMail(
    @Body() dto: SendMailDto,
  ): Promise<ResponseResult<UserResponse>> {
    const result = await this._userService.sendMail(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._userService.delete(id);
  }
}
