import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminChangePasswordCommandHandler } from './admin-change-password-command.handler';
import { AdminChangePasswordCommand } from '../admin-change-password.command';

function makeWrite() {
  return { updatePasswordAndStamp: jest.fn(async () => undefined) } as any;
}

function makeManager(user: any) {
  return { findOne: jest.fn(async () => user) } as any;
}

describe('AdminChangePasswordCommandHandler', () => {
  beforeEach(() => jest.clearAllMocks());

  it('rejects non-numeric id', async () => {
    const handler = new AdminChangePasswordCommandHandler(makeWrite());
    const cmd = new AdminChangePasswordCommand(
      NaN,
      { new_password: 'abcdef', confirm_password: 'abcdef' } as any,
      makeManager({ id: 1 }),
    );

    await expect(handler.execute(cmd)).rejects.toMatchObject({
      message: 'errors.must_be_number',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  });

  it('rejects when target user not found', async () => {
    const write = makeWrite();
    const handler = new AdminChangePasswordCommandHandler(write);
    const cmd = new AdminChangePasswordCommand(
      99,
      { new_password: 'abcdef', confirm_password: 'abcdef' } as any,
      makeManager(null),
    );

    await expect(handler.execute(cmd)).rejects.toMatchObject({
      message: 'errors.not_found',
      statusCode: HttpStatus.NOT_FOUND,
    });
    expect(write.updatePasswordAndStamp).not.toHaveBeenCalled();
  });

  it('happy path — sets password without old password and stamps', async () => {
    const write = makeWrite();
    const handler = new AdminChangePasswordCommandHandler(write);
    const cmd = new AdminChangePasswordCommand(
      7,
      { new_password: 'resetForUser', confirm_password: 'resetForUser' } as any,
      makeManager({ id: 7 }),
    );

    const result = await handler.execute(cmd);
    expect(result).toEqual({
      message: 'Password has been changed successfully',
    });
    expect(write.updatePasswordAndStamp).toHaveBeenCalledTimes(1);
    const [idArg, hashedArg] = write.updatePasswordAndStamp.mock.calls[0];
    expect(idArg).toBe(7);
    expect(await bcrypt.compare('resetForUser', hashedArg)).toBe(true);
  });
});
