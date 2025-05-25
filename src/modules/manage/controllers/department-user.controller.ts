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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { DEPARTMENT_USER_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { CreateDepartmentUserDto } from '../application/dto/create/departmentUser/create.dto';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { IDepartmentUserServiceInterface } from '../domain/ports/input/department-user-domain-service.interface';
import { DepartmentUserDataMapper } from '../application/mappers/department-user.mapper';
import { DepartmentUserResponse } from '../application/dto/response/department-user.response';
import { UpdateDepartmentUserDto } from '../application/dto/create/departmentUser/update.dto';
import { DepartmentUserQueryDto } from '../application/dto/query/department-user-query.dto';
import { UploadFileDto } from '../application/dto/create/departmentUser/upload.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
// import { Request } from 'express';

@Controller('department-users')
export class DepartmentUserController {
  constructor(
    @Inject(DEPARTMENT_USER_APPLICATION_SERVICE)
    private readonly _departmentUserService: IDepartmentUserServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: DepartmentUserDataMapper,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
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
            Date.now() + // for uniqueness
            path.extname(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(
    @Body() body: UploadFileDto,
    @UploadedFiles() files: Express.Multer.File[],
    // @Req() req: Request,
  ) {
    // const host = `${req.protocol}://${req.get('host')}`; // e.g. http://localhost:3000
    const uploadedFiles = files.map((file) => {
      const fileUrl = `${file.filename}`;
      return fileUrl;
    });

    return {
      files: uploadedFiles,
    };
  }

  @Post('')
  async create(
    @Body() dto: CreateDepartmentUserDto,
  ): Promise<ResponseResult<DepartmentUserResponse>> {
    const result = await this._departmentUserService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

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
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDepartmentUserDto,
  ): Promise<ResponseResult<DepartmentUserResponse>> {
    const result = await this._departmentUserService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._departmentUserService.delete(id);
  }
}
