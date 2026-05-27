import { ForgotPasswordCommandHandler } from './forgot-password-command.handler';
import { ForgotPasswordCommand } from '../forgot-password.command';

function makeJwt(token = 'signed-token') {
  return {
    signAsync: jest.fn(async () => token),
  } as any;
}

function makeSender() {
  return { execute: jest.fn(async () => undefined) } as any;
}

function makeConfig(expires = '15m') {
  return {
    get: jest.fn(() => expires),
  } as any;
}

function makeManager(user: any) {
  return { findOne: jest.fn(async () => user) } as any;
}

const GENERIC = 'If the email is registered, a reset link has been sent';

describe('ForgotPasswordCommandHandler', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns generic message and skips enqueue when email unknown', async () => {
    const sender = makeSender();
    const handler = new ForgotPasswordCommandHandler(
      makeJwt(),
      sender,
      makeConfig(),
    );

    const result = await handler.execute(
      new ForgotPasswordCommand(
        { email: 'unknown@example.com' } as any,
        makeManager(null),
      ),
    );

    expect(result).toEqual({ message: GENERIC });
    expect(sender.execute).not.toHaveBeenCalled();
  });

  it('signs token and enqueues mail when email known', async () => {
    const jwt = makeJwt('jwt-abc');
    const sender = makeSender();
    const handler = new ForgotPasswordCommandHandler(
      jwt,
      sender,
      makeConfig('15m'),
    );

    const result = await handler.execute(
      new ForgotPasswordCommand(
        { email: 'phet@example.com' } as any,
        makeManager({
          id: 9,
          email: 'phet@example.com',
          first_name: 'Phet',
          last_name: 'A.',
          username: 'phet',
        }),
      ),
    );

    expect(result).toEqual({ message: GENERIC });
    expect(jwt.signAsync).toHaveBeenCalledWith({
      user_id: 9,
      email: 'phet@example.com',
      purpose: 'reset-password',
    });
    expect(sender.execute).toHaveBeenCalledWith({
      to: 'phet@example.com',
      displayName: 'Phet A.',
      token: 'jwt-abc',
      expiresInMinutes: 15,
    });
  });

  it('returns generic message even if mail sender throws', async () => {
    const sender = {
      execute: jest.fn(async () => {
        throw new Error('boom');
      }),
    } as any;
    const handler = new ForgotPasswordCommandHandler(
      makeJwt(),
      sender,
      makeConfig(),
    );

    const result = await handler.execute(
      new ForgotPasswordCommand(
        { email: 'phet@example.com' } as any,
        makeManager({
          id: 9,
          email: 'phet@example.com',
          username: 'phet',
          first_name: null,
          last_name: null,
        }),
      ),
    );

    expect(result).toEqual({ message: GENERIC });
    expect(sender.execute).toHaveBeenCalled();
  });
});
