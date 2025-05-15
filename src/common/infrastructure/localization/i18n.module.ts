import { Global, Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule as NestI18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { LOCALIZATION_SERVICE } from '@src/common/constants/inject-key.const';
import { LocalizationService } from './localization.service';

const LOCALE_KEY = ['locale', 'lang', 'x-lang'];

@Global()
@Module({
  imports: [
    NestI18nModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          // path: join(__dirname, '../localization/i18n/'),
          path: join(__dirname, 'i18n/'),
          watch: configService.get<string>('NODE_ENV') === 'development',
        },
      }),
      resolvers: [
        new QueryResolver(LOCALE_KEY),
        new HeaderResolver(LOCALE_KEY),
        AcceptLanguageResolver,
      ],
    }),
  ],
  providers: [
    {
      provide: LOCALIZATION_SERVICE,
      useClass: LocalizationService,
    },
  ],
  exports: [NestI18nModule, LOCALIZATION_SERVICE],
})
export class I18nModule {}
