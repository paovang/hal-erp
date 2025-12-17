import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailService } from '../domain/mail.service';

@Injectable()
export class MailServiceImpl implements IMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      template, // เช่น 'welcome' → จะไปหา templates/welcome.hbs
      context, // data ที่ใช้ใน template
    });
  }
}
