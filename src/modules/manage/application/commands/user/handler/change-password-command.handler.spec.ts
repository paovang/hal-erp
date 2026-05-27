import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ChangePasswordCommandHandler } from './change-password-command.handler';
import { ChangePasswordCommand } from '../change-password.command';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';

function makeManager(user: Partial<UserOrmEntity> | null) {
  return {
    findOne: jest.fn(async () => user ?? null),
  } as any;
}

function makeWriteRepo() {
  return {
    updatePasswordAndStamp: jest.fn(async () => undefined),
  } as any;
}

describe('ChangePasswordCommandHandler', () => {
  beforeEach(() => jest.clearAllMocks());

  it('rejects unauthenticated user id', async () => {
    const handler = new ChangePasswordCommandHandler(makeWriteRepo());
    const cmd = new ChangePasswordCommand(
      0,
      { old_password: 'a', new_password: 'b', confirm_password: 'b' } as any,
      makeManager(null),
    );

    await expect(handler.execute(cmd)).rejects.toMatchObject({
      message: 'errors.unauthorized',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  });

  it('rejects when old_password does not match', async () => {
    const storedHash = await bcrypt.hash('correctOld', 10);
    const write = makeWriteRepo();
    const handler = new ChangePasswordCommandHandler(write);
    const cmd = new ChangePasswordCommand(
      42,
      {
        old_password: 'wrongOld',
        new_password: 'brandNewSecret',
        confirm_password: 'brandNewSecret',
      } as any,
      makeManager({ id: 42, password: storedHash }),
    );

    await expect(handler.execute(cmd)).rejects.toMatchObject({
      i18nKey: 'errors.incorrect_password',
      status: HttpStatus.BAD_REQUEST,
    } as Partial<ManageDomainException>);
    expect(write.updatePasswordAndStamp).not.toHaveBeenCalled();
  });

  it('happy path — updates password and stamp', async () => {
    const storedHash = await bcrypt.hash('currentSecret', 10);
    const write = makeWriteRepo();
    const manager = makeManager({ id: 7, password: storedHash });
    const handler = new ChangePasswordCommandHandler(write);
    const cmd = new ChangePasswordCommand(
      7,
      {
        old_password: 'currentSecret',
        new_password: 'newSecret123',
        confirm_password: 'newSecret123',
      } as any,
      manager,
    );

    const result = await handler.execute(cmd);
    expect(result).toEqual({
      message: 'Password has been changed successfully',
    });
    expect(write.updatePasswordAndStamp).toHaveBeenCalledTimes(1);
    const [userIdArg, hashedArg] = write.updatePasswordAndStamp.mock.calls[0];
    expect(userIdArg).toBe(7);
    expect(hashedArg).not.toBe('newSecret123');
    expect(await bcrypt.compare('newSecret123', hashedArg)).toBe(true);
  });
});
