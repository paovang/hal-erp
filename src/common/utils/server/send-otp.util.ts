// src/common/utils/send-otp.util.ts
import axios from 'axios';
import { HttpStatus } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

export async function sendOtpUtil(
  id: number,
  user: any,
  tel: string,
): Promise<any> {
  const playLoad = {
    source_system: 'E-DOCUMENT',
    source_request_id: id,
    approver: {
      id: user?.id,
      username: user?.username,
      email: user?.email,
      tel,
    },
    ip_address: '183.182.111.228',
    user_agent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  };

  const apiUrl = process.env.APPROVAL_API_URL || 'http://127.0.0.1:3001';
  console.log('playLoad', playLoad);
  console.log('apiUrl', apiUrl);
  try {
    const response = await axios.post(`${apiUrl}/send-otp`, playLoad, {
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

    return response.data.data;
  } catch (error: any) {
    throw new ManageDomainException('errors.send_otp', HttpStatus.BAD_REQUEST, {
      property: error.response?.data?.message ?? 'Unknown error',
    });
  }
}
