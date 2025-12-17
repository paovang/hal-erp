import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SendMailUseCase } from './send-mail.usecase';
@Injectable()
export class SendEmailUserUseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly sendMailUseCase: SendMailUseCase,
    private readonly jwtService: JwtService,
  ) {}
  async execute(user: { email: string }) {
    const emailToken = this.jwtService.sign(
      {
        email: user.email,
      },
      {
        expiresIn: '5m',
      },
    );
    await this.sendMailUseCase.execute(
      user.email,
      'Welcome to our system 🎉',
      'sendMail',
      {
        verifyLink: `verify?token=${emailToken}`,
      },
    );
    return { message: 'Email sent' };
  }
}
