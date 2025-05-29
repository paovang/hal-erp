import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import {
  AMAZON_CLOUDFRONT_KEY,
  AMAZON_S3_BUCKET_KEY,
  AMAZON_S3_OPTION_KEY,
  AMAZON_S3_SERVICE_KEY,
  AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME,
  AWS_DISTRIBUTIONS_KEY,
} from './inject-key';
import { CloudFront } from '@aws-sdk/client-cloudfront';
import { S3Service } from '../service/aws3-image.service';

@Global()
@Module({})
export class AmazonS3Module {
  static forRootAsync(): DynamicModule {
    return {
      module: AmazonS3Module,
      providers: [
        {
          inject: [ConfigService],
          provide: AWS_DISTRIBUTIONS_KEY,
          useFactory: (configService: ConfigService) => {
            return configService.getOrThrow<string>('AWS_DISTRIBUTIONS_ID');
          },
        },
        {
          provide: AMAZON_CLOUDFRONT_KEY,
          inject: [ConfigService],
          useFactory: async (
            configService: ConfigService,
          ): Promise<CloudFront> => {
            return new CloudFront({
              region: configService.getOrThrow<string>('AWS_REGION'),
              credentials: configService.get<string>('AWS_ACCESS_KEY_ID')
                ? {
                    accessKeyId:
                      configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
                    secretAccessKey: configService.getOrThrow<string>(
                      'AWS_SECRET_ACCESS_KEY',
                    ),
                  }
                : undefined,
            });
          },
        },
        {
          provide: AMAZON_S3_OPTION_KEY,
          inject: [ConfigService],
          useFactory: async (
            configService: ConfigService,
          ): Promise<S3Client> => {
            return new S3Client({
              region: configService.getOrThrow<string>('AWS_REGION'),
              credentials: configService.get<string>('AWS_ACCESS_KEY_ID')
                ? {
                    accessKeyId:
                      configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
                    secretAccessKey: configService.getOrThrow<string>(
                      'AWS_SECRET_ACCESS_KEY',
                    ),
                  }
                : undefined,
            });
          },
        },
        {
          inject: [ConfigService],
          provide: AMAZON_S3_BUCKET_KEY,
          useFactory: (configService: ConfigService) => {
            return configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
          },
        },
        {
          inject: [ConfigService],
          provide: AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME,
          useFactory: (configService: ConfigService) => {
            return configService.getOrThrow<string>(
              'AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME',
            );
          },
        },
        {
          provide: AMAZON_S3_SERVICE_KEY,
          useClass: S3Service,
        },
      ],
      exports: [AMAZON_S3_SERVICE_KEY, AMAZON_S3_BUCKET_KEY],
    };
  }
}
// department_signature/01970ac6-7038-73b2-a38c-ce1fc3649e74-1748232466487
// department_signature/01970ac9-77aa-717c-bca2-e5b6d39c6704-1748232665002
// department_signature/01970aca-eeb3-700e-82d2-ebfc6d7bc9b1-1748232761011
