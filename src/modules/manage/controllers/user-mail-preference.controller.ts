import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Put,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { UserMailPreferenceOrmEntity } from '@src/common/infrastructure/database/typeorm/user-mail-preference.orm';
import { isValidWindow } from '@src/common/utils/mail-window.util';
import { ManageDomainException } from '../domain/exceptions/manage-domain.exception';
import { USER_MAIL_PREFERENCE_REPOSITORY } from '../application/constants/inject-key.const';
import { IUserMailPreferenceRepository } from '../domain/ports/output/user-mail-preference-repository.interface';
import { UpdateMailPreferenceDto } from '../application/dto/create/userMailPreference/update-mail-preference.dto';

interface MailPreferenceResponse {
  user_id: number;
  start_time: string | null;
  end_time: string | null;
  is_enabled: boolean;
}

@Controller('users')
export class UserMailPreferenceController {
  constructor(
    @Inject(USER_MAIL_PREFERENCE_REPOSITORY)
    private readonly _repo: IUserMailPreferenceRepository,
    @InjectRepository(UserOrmEntity)
    private readonly _userRepository: Repository<UserOrmEntity>,
  ) {}

  @Get(':id/mail-preference')
  async get(@Param('id') id: number): Promise<MailPreferenceResponse | null> {
    const pref = await this._repo.findByUserId(Number(id));
    return pref ? this.toResponse(pref) : null;
  }

  @Put(':id/mail-preference')
  async upsert(
    @Param('id') id: number,
    @Body() dto: UpdateMailPreferenceDto,
  ): Promise<MailPreferenceResponse> {
    const user = await this._userRepository.findOne({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        { property: `User ID: ${id}` },
      );
    }

    // When enabled, both bounds are required and must form a valid same-day
    // window — reuse the same rule the deferral logic uses.
    if (dto.is_enabled) {
      if (
        !dto.start_time ||
        !dto.end_time ||
        !isValidWindow(dto.start_time, dto.end_time)
      ) {
        throw new ManageDomainException(
          'errors.invalid_mail_window',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const saved = await this._repo.upsert(Number(id), {
      start_time: dto.start_time ?? null,
      end_time: dto.end_time ?? null,
      is_enabled: dto.is_enabled,
    });

    return this.toResponse(saved);
  }

  private toResponse(
    pref: UserMailPreferenceOrmEntity,
  ): MailPreferenceResponse {
    return {
      user_id: pref.user_id,
      start_time: pref.start_time,
      end_time: pref.end_time,
      is_enabled: pref.is_enabled,
    };
  }
}
