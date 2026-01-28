import axios from 'axios';
import { HttpStatus } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { EnumSendOtpStatus } from '@src/modules/manage/application/constants/status-key.const';
import { ApproveStepCommand } from '@src/modules/manage/application/commands/userApprovalStep/approve-step.command';

export async function verifyOtp(
  query: ApproveStepCommand,
  status: string,
  tel: string,
): Promise<void> {
  const apiUrl = process.env.APPROVAL_API_URL || 'http://127.0.0.1:3001';
  let send_status = null;

  if (status === 'APPROVED') {
    send_status = EnumSendOtpStatus.APPROVED;
  } else if (status === 'REJECTED') {
    send_status = EnumSendOtpStatus.REJECTED;
  } else {
    throw new ManageDomainException(
      'errors.not_found',
      HttpStatus.BAD_REQUEST,
      { property: `${status}` },
    );
  }

  console.log('test');

  // Build the playLoad object here inside the util function
  const playLoad = {
    approval_id: query.dto.approval_id,
    otp: query.dto.otp,
    tel: tel,
    status: send_status,
    ip_address: '183.182.111.228', // default IP if not provided
    user_agent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  };

  console.log('playLoad', playLoad);

  try {
    const response = await axios.post(`${apiUrl}/verify-otp`, playLoad, {
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': process.env.APPROVAL_SECRET_KEY,
      },
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new ManageDomainException(
        'errors.send_otp',
        HttpStatus.BAD_REQUEST,
        { property: response.data },
      );
    }
  } catch (error: any) {
    console.error('❌ Approval API Error:', {
      status: error.response?.status,
      message: error.response?.data,
    });
    throw new ManageDomainException('errors.send_otp', HttpStatus.BAD_REQUEST, {
      property: error.response?.data?.message ?? 'Unknown error',
    });
  }
}
