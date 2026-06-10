import { UserMailPreferenceController } from './user-mail-preference.controller';
import { ManageDomainException } from '../domain/exceptions/manage-domain.exception';
import { IUserMailPreferenceRepository } from '../domain/ports/output/user-mail-preference-repository.interface';

describe('UserMailPreferenceController', () => {
  let repo: jest.Mocked<IUserMailPreferenceRepository>;
  let userRepository: { findOne: jest.Mock };
  let userContext: { getAuthUser: jest.Mock };
  let controller: UserMailPreferenceController;

  const asUser = (id: number, roles: string[] = []) =>
    userContext.getAuthUser.mockReturnValue({ user: { id }, roles });

  beforeEach(() => {
    repo = {
      findByUserId: jest.fn(),
      upsert: jest.fn(),
    };
    userRepository = { findOne: jest.fn().mockResolvedValue({ id: 7 }) };
    userContext = { getAuthUser: jest.fn() };
    controller = new UserMailPreferenceController(
      repo,
      userRepository as any,
      userContext as any,
    );
  });

  describe('authorization', () => {
    it('allows a user to read their own preference', async () => {
      asUser(7);
      repo.findByUserId.mockResolvedValue(null);
      await expect(controller.get(7)).resolves.toBeNull();
      expect(repo.findByUserId).toHaveBeenCalledWith(7);
    });

    it('allows an admin to read another user', async () => {
      asUser(99, ['admin']);
      repo.findByUserId.mockResolvedValue(null);
      await expect(controller.get(7)).resolves.toBeNull();
    });

    it('allows a super-admin to read another user', async () => {
      asUser(99, ['super-admin']);
      repo.findByUserId.mockResolvedValue(null);
      await expect(controller.get(7)).resolves.toBeNull();
    });

    it('rejects a non-admin targeting another user (403)', async () => {
      asUser(8);
      await expect(controller.get(7)).rejects.toBeInstanceOf(
        ManageDomainException,
      );
      expect(repo.findByUserId).not.toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('returns the preference when present', async () => {
      asUser(7);
      repo.findByUserId.mockResolvedValue({
        user_id: 7,
        start_time: '08:00:00',
        end_time: '17:00:00',
        is_enabled: true,
      } as any);

      await expect(controller.get(7)).resolves.toEqual({
        user_id: 7,
        start_time: '08:00:00',
        end_time: '17:00:00',
        is_enabled: true,
      });
    });

    it('returns null when absent', async () => {
      asUser(7);
      repo.findByUserId.mockResolvedValue(null);
      await expect(controller.get(7)).resolves.toBeNull();
    });
  });

  describe('upsert validation', () => {
    beforeEach(() => asUser(7));

    it('accepts a valid same-day window', async () => {
      repo.upsert.mockResolvedValue({
        user_id: 7,
        start_time: '08:00',
        end_time: '17:00',
        is_enabled: true,
      } as any);

      await controller.upsert(7, {
        is_enabled: true,
        start_time: '08:00',
        end_time: '17:00',
      });

      expect(repo.upsert).toHaveBeenCalledWith(7, {
        start_time: '08:00',
        end_time: '17:00',
        is_enabled: true,
      });
    });

    it('rejects a crossing-midnight window (400)', async () => {
      await expect(
        controller.upsert(7, {
          is_enabled: true,
          start_time: '22:00',
          end_time: '06:00',
        }),
      ).rejects.toBeInstanceOf(ManageDomainException);
      expect(repo.upsert).not.toHaveBeenCalled();
    });

    it('rejects enabled without both bounds (400)', async () => {
      await expect(
        controller.upsert(7, { is_enabled: true, start_time: '08:00' }),
      ).rejects.toBeInstanceOf(ManageDomainException);
    });

    it('accepts disabled without times', async () => {
      repo.upsert.mockResolvedValue({
        user_id: 7,
        start_time: null,
        end_time: null,
        is_enabled: false,
      } as any);

      await controller.upsert(7, { is_enabled: false });

      expect(repo.upsert).toHaveBeenCalledWith(7, {
        start_time: null,
        end_time: null,
        is_enabled: false,
      });
    });
  });

  describe('upsert behavior', () => {
    beforeEach(() => asUser(7));

    it('rejects when the target user does not exist (404)', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(
        controller.upsert(7, { is_enabled: false }),
      ).rejects.toBeInstanceOf(ManageDomainException);
      expect(repo.upsert).not.toHaveBeenCalled();
    });

    it('delegates create/update to the repository upsert', async () => {
      repo.upsert.mockResolvedValue({
        user_id: 7,
        start_time: null,
        end_time: null,
        is_enabled: false,
      } as any);

      const result = await controller.upsert(7, { is_enabled: false });
      expect(result.user_id).toBe(7);
      expect(repo.upsert).toHaveBeenCalledTimes(1);
    });
  });
});
