import { Injectable, Inject } from '@nestjs/common';
import { type IMailService } from '../domain/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SendMailUseCase {
  constructor(
    @Inject('IMailService')
    private readonly mailService: IMailService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    to: string,
    subject: string,
    template: string,
    context: any,
  ): Promise<void> {
    await this.mailService.sendMail(to, subject, template, context);
  }
}
