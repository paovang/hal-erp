import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SendMailUseCase } from './application/send-mail.usecase';
import { MailServiceImpl } from './infrastructure/mail.service.impl';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SendEmailUserUseCase } from './application/sendMail-User.usecase';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (_config: ConfigService) => ({
        secret: 'phetaibtc@gmail.com',
        signOptions: {
          expiresIn: '3d',
        },
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (_config) => ({
        global: true,
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'phetaibtc@gmail.com',
            pass: 'rofaurwigibjrrcn',
          },
        },
        defaults: {
          from: 'Your Name <phetaibtc@gmail.com>',
        },
        template: {
          dir: join(process.cwd(), 'src/common/infrastructure/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      // useFactory: async (config) => ({
      //   global: true,
      //   transport: {
      //     host: config.getOrThrow('SMTP_HOST'),
      //     port: config.getOrThrow('SMTP_PORT'),
      //     secure: config.getOrThrow('SMTP_SECURE') === 'true',
      //     auth: {
      //       user: config.getOrThrow('SMTP_USER'),
      //       pass: config.getOrThrow('SMTP_PASSWORD'),
      //     },
      //   },
      //   defaults: {
      //     from: config.getOrThrow('SMTP_FROM'),
      //   },
      //   template: {
      //     dir: join(process.cwd(), 'src/modules/mail/templates'),
      //     adapter: new HandlebarsAdapter(),
      //     options: {
      //       strict: true,
      //     },
      //   },
      // }),
    }),
  ],
  providers: [
    SendMailUseCase,
    { provide: 'IMailService', useClass: MailServiceImpl },
    SendEmailUserUseCase,
  ],
  exports: [SendMailUseCase, SendEmailUserUseCase],
})
export class MailModule {}
