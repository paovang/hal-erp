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
} from '@nestjs/common';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { USER_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IUserServiceInterface } from '../domain/ports/input/user-domain-service.interface';
import { UserDataMapper } from '../application/mappers/user.mapper';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CreateUserDto } from '../application/dto/create/user/create.dto';
import { UserResponse } from '../application/dto/response/user.response';
import { UserQueryDto } from '../application/dto/query/user-query.dto';
import { UpdateUserDto } from '../application/dto/create/user/update.dto';
import { ChangePasswordDto } from '../application/dto/create/user/change-password.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_APPLICATION_SERVICE)
    private readonly _userService: IUserServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: UserDataMapper,
  ) {}

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

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._userService.delete(id);
  }
}
