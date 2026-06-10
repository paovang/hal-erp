import { Provider } from '@nestjs/common';
import { USER_MAIL_PREFERENCE_REPOSITORY } from '../../constants/inject-key.const';
import { UserMailPreferenceRepository } from '@src/modules/manage/infrastructure/repositories/userMailPreference/user-mail-preference.repository';

export const UserMailPreferenceProvider: Provider[] = [
  {
    provide: USER_MAIL_PREFERENCE_REPOSITORY,
    useClass: UserMailPreferenceRepository,
  },
];
