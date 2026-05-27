import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ResetPasswordCommandHandler } from './reset-password-command.handler';
import { ResetPasswordCommand } from '../reset-password.command';

function makeJwt(verify: () => Promise<any>) {
  return { verifyAsync: jest.fn(verify) } as any;
}

function makeTxManager() {
  return {
    runInTransaction: jest.fn(async (_ds: any, op: any) => op({} as any)),
  } as any;
}

function makeWrite() {
  return { updatePasswordAndStamp: jest.fn(async () => undefined) } as any;
}

function makeDataSource() {
  return {} as any;
}

function makeManagerWithUser(user: any) {
  // injected during runInTransaction op
  return user;
}

function withManager(user: any) {
  return {
    runInTransaction: jest.fn(async (_ds: any, op: any) =>
      op({ findOne: jest.fn(async () => user) } as any),
    ),
  } as any;
}

const okPayload = (overrides: any = {}) => ({
  user_id: 5,
  email: 'phet@example.com',
  purpose: 'reset-password',
  iat: 2000,
  exp: 9999999999,
  ...overrides,
});

describe('ResetPasswordCommandHandler', () => {
  beforeEach(() => jest.clearAllMocks());

  it('rejects expired/invalid token (verifyAsync throws)', async () => {
    const handler = new ResetPasswordCommandHandler(
      makeWrite(),
      makeJwt(async () => {
        throw new Error('expired');
      }),
      makeTxManager(),
      makeDataSource(),
    );

    await expect(
      handler.execute(
        new ResetPasswordCommand(
          {
            token: 't',
            new_password: 'newSecret',
            confirm_password: 'newSecret',
          } as any,
          {} as any,
        ),
      ),
    ).rejects.toMatchObject({
      message: 'errors.invalid_or_expired_token',
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  });

  it('rejects token with wrong purpose', async () => {
    const handler = new ResetPasswordCommandHandler(
      makeWrite(),
      makeJwt(async () => okPayload({ purpose: 'reset-pin' })),
      makeTxManager(),
      makeDataSource(),
    );

    await expect(
      handler.execute(
        new ResetPasswordCommand(
          {
            token: 't',
            new_password: 'newSecret',
            confirm_password: 'newSecret',
          } as any,
          {} as any,
        ),
      ),
    ).rejects.toMatchObject({
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  });

  it('rejects when user is missing', async () => {
    const handler = new ResetPasswordCommandHandler(
      makeWrite(),
      makeJwt(async () => okPayload()),
      withManager(null),
      makeDataSource(),
    );

    await expect(
      handler.execute(
        new ResetPasswordCommand(
          {
            token: 't',
            new_password: 'newSecret',
            confirm_password: 'newSecret',
          } as any,
          {} as any,
        ),
      ),
    ).rejects.toMatchObject({
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  });

  it('rejects when user.email no longer matches payload', async () => {
    const handler = new ResetPasswordCommandHandler(
      makeWrite(),
      makeJwt(async () => okPayload({ email: 'old@example.com' })),
      withManager({
        id: 5,
        email: 'new@example.com',
        password_changed_at: null,
      }),
      makeDataSource(),
    );

    await expect(
      handler.execute(
        new ResetPasswordCommand(
          {
            token: 't',
            new_password: 'newSecret',
            confirm_password: 'newSecret',
          } as any,
          {} as any,
        ),
      ),
    ).rejects.toMatchObject({
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  });

  it('rejects replay: iat < password_changed_at', async () => {
    const handler = new ResetPasswordCommandHandler(
      makeWrite(),
      makeJwt(async () => okPayload({ iat: 1000 })),
      withManager({
        id: 5,
        email: 'phet@example.com',
        // changed at second 1500 → token iat=1000 is older
        password_changed_at: new Date(1500 * 1000),
      }),
      makeDataSource(),
    );

    await expect(
      handler.execute(
        new ResetPasswordCommand(
          {
            token: 't',
            new_password: 'newSecret',
            confirm_password: 'newSecret',
          } as any,
          {} as any,
        ),
      ),
    ).rejects.toMatchObject({
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  });

  it('happy path: hashes password and updates stamp', async () => {
    const write = makeWrite();
    const handler = new ResetPasswordCommandHandler(
      write,
      makeJwt(async () => okPayload()),
      withManager({
        id: 5,
        email: 'phet@example.com',
        password_changed_at: null,
      }),
      makeDataSource(),
    );

    const result = await handler.execute(
      new ResetPasswordCommand(
        {
          token: 't',
          new_password: 'brandNewSecret',
          confirm_password: 'brandNewSecret',
        } as any,
        {} as any,
      ),
    );

    expect(result).toEqual({
      message: 'Password has been reset successfully',
    });
    expect(write.updatePasswordAndStamp).toHaveBeenCalledTimes(1);
    const [userIdArg, hashedArg] = write.updatePasswordAndStamp.mock.calls[0];
    expect(userIdArg).toBe(5);
    expect(await bcrypt.compare('brandNewSecret', hashedArg)).toBe(true);
  });
});

// silence unused import warning from helpers
void makeManagerWithUser;
