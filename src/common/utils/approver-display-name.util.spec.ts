import { approverDisplayName } from './approver-display-name.util';

describe('approverDisplayName', () => {
  it('uses first + last name (snake_case)', () => {
    expect(approverDisplayName({ first_name: 'Som', last_name: 'Chan' })).toBe(
      'Som Chan',
    );
  });

  it('uses first + last name (camelCase / domain entity shape)', () => {
    expect(approverDisplayName({ firstName: 'Som', lastName: 'Chan' })).toBe(
      'Som Chan',
    );
  });

  it('uses only the available name part', () => {
    expect(approverDisplayName({ first_name: 'Som', last_name: null })).toBe(
      'Som',
    );
  });

  it('falls back to username when no name parts', () => {
    expect(approverDisplayName({ username: 'budget', email: 'b@x.com' })).toBe(
      'budget',
    );
  });

  it('falls back to email local-part when no name or username', () => {
    expect(approverDisplayName({ email: 'budget@example.com' })).toBe('budget');
  });

  it('returns empty string for undefined user', () => {
    expect(approverDisplayName(undefined)).toBe('');
  });
});
