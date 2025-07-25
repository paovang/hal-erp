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
import { BANK_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import {
  PROFILE_IMAGE_ALLOW_MIME_TYPE,
  TRANSFORM_RESULT_SERVICE,
} from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IBankServiceInterface } from '../domain/ports/input/bank-domain-service.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from '@src/common/interceptors/file/file.interceptor';
import { FileMimeTypeValidator } from '@src/common/validations/file-mime-type.validator';
import { FileSizeValidator } from '@src/common/validations/file-size.validator';
import { BankResponse } from '../application/dto/response/bank.response';
import { BankDataMapper } from '../application/mappers/bank.mapper';
import { UpdateBankDto } from '../application/dto/create/banks/update.dto';
import { CreateBankDto } from '../application/dto/create/banks/create.dto';
import { BankQueryDto } from '../application/dto/query/bank-query.dto';

@Controller('banks')
export class BankController {
  constructor(
    @Inject(BANK_APPLICATION_SERVICE)
    private readonly _bankService: IBankServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: BankDataMapper,
  ) {}

  @Post('')
  @UseInterceptors(
    FileInterceptor('logo'),
    new FileValidationInterceptor(
      new FileMimeTypeValidator([...PROFILE_IMAGE_ALLOW_MIME_TYPE]),
      new FileSizeValidator(5 * 1024 * 1024),
      'logo',
    ),
  )
  async create(
    @Body() dto: CreateBankDto,
    @UploadedFile() logo: Express.Multer.File,
  ): Promise<ResponseResult<BankResponse>> {
    const result = await this._bankService.create(dto, logo);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: BankQueryDto,
  ): Promise<ResponseResult<BankResponse>> {
    const result = await this._bankService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ResponseResult<BankResponse>> {
    const result = await this._bankService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('logo'),
    new FileValidationInterceptor(
      new FileMimeTypeValidator([...PROFILE_IMAGE_ALLOW_MIME_TYPE]),
      new FileSizeValidator(5 * 1024 * 1024),
      'logo',
    ),
  )
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateBankDto,
    @UploadedFile() logo: Express.Multer.File,
  ): Promise<ResponseResult<BankResponse>> {
    const result = await this._bankService.update(id, dto, logo);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._bankService.delete(id);
  }
}
