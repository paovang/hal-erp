import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { SendOTPCommand } from '../send-otp.command';
import { HttpStatus } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { sendOtpUtil } from '@src/common/utils/server/send-otp.util';
import { SendEmailUserUseCase } from '@src/common/infrastructure/mail/application/sendMail-User.usecase';

@CommandHandler(SendOTPCommand)
export class SendOTPCommandHandler
  implements IQueryHandler<SendOTPCommand, any>
{
  constructor(
    private readonly _userContextService: UserContextService,
    private readonly _sendEmailUserUseCase: SendEmailUserUseCase,
  ) {}

  async execute(query: SendOTPCommand): Promise<any> {
    const user = this._userContextService.getAuthUser()?.user;
    let tel = user?.tel ? String(user.tel).trim() : '';

    if (!tel.match(/^\d+$/)) {
      throw new ManageDomainException(
        'errors.invalid_tel',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!tel.startsWith('20')) {
      tel = '20' + tel;
    }

    // Validate id
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    // Check if approval step exists
    await findOneOrFail(
      query.manager,
      UserApprovalStepOrmEntity,
      {
        id: query.id,
      },
      'step',
    );

    console.log('object');
    await this._sendEmailUserUseCase.execute({ email: user.email });
    return await sendOtpUtil(query.id, user, tel);
  }
}
