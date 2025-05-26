import { Catch, HttpException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseGlobalExceptionFilter } from '@common/infrastructure/exception-handler/base-global-exception.filter';
import { DomainException } from '@common/domain/exceptions/domain.exception';
import { LOCALIZATION_SERVICE } from '@common/constants/inject-key.const';
import { ILocalizationService } from '@common/infrastructure/localization/interface/localization.interface';

@Catch(HttpException, DomainException, Error)
export class GlobalExceptionFilter extends BaseGlobalExceptionFilter {
  constructor(
    configService: ConfigService,
    @Inject(LOCALIZATION_SERVICE) localizationService: ILocalizationService,
    // @Inject(SLACK_PRODUCER_SERVICE) slackService: ISlackNotificationProducer,
    // @Inject(AUTH_ALS_SERVICE_KEY) authAlsService: AuthAlsService,
  ) {
    super(configService, localizationService);
    // super(configService, localizationService, slackService, authAlsService);
  }
}
