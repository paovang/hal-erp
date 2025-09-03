import axios from 'axios';
import moment from 'moment-timezone';
import { HttpStatus } from '@nestjs/common';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { EnumRequestApprovalType } from '@src/modules/manage/application/constants/status-key.const';

export async function sendApprovalRequest(
  user_approval_step_id: number,
  total: number,
  user: UserEntity,
  user_id: number,
  department_name: string,
  type: EnumRequestApprovalType,
  titles?: string,
) {
  const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
  let tel = user?.tel ? String(user.tel).trim() : '';

  if (!tel.match(/^\d+$/)) {
    throw new ManageDomainException(
      'Invalid tel: must contain digits only',
      HttpStatus.BAD_REQUEST,
    );
  }

  if (!tel.startsWith('20')) {
    tel = '20' + tel;
  }

  console.log('type', type);

  const send_data_to_approval = {
    source_request_id: Number(user_approval_step_id),
    source_system: 'E-DOCUMENT',
    request_type: type,
    request_amount: Number(total),
    title: String(titles) ?? 'ຂໍຈັດຊື້',
    due_date: now,
    // due_date: '2025-08-31 00:32:07',
    callback_url: 'http://127.0.0.1:3001',
    requester: {
      id: Number(user_id),
      username: String(user.username),
      email: String(user.email),
      tel: String(tel),
      department: String(department_name),
    },
  };
  console.log('object to send approval', send_data_to_approval);
  const apiUrl = process.env.APPROVAL_API_URL || 'http://127.0.0.1:3001';
  try {
    const response = await axios.post(
      `${apiUrl}/create`,
      send_data_to_approval,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-secret-key': process.env.APPROVAL_SECRET_KEY,
        },
      },
    );

    console.log('object response', response.data);

    if (response.status !== 200 && response.status !== 201) {
      throw new ManageDomainException(
        'errors.send_request',
        HttpStatus.BAD_REQUEST,
        { property: response.data.message },
      );
    }

    return response.data;
  } catch (error: any) {
    console.error('❌ Approval API Error:', {
      status: error.response?.status,
      message: error.response?.data,
    });

    console.error('❌ Approval API Error:', {
      status: error.response?.status,
      message: error.response?.data.errors,
    });

    throw new ManageDomainException(
      'errors.send_request',
      HttpStatus.BAD_REQUEST,
      { property: error.response?.data?.message || error.message },
    );
  }
}
