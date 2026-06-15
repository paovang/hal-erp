/**
 * Compose an approver's display name for approval emails:
 * firstName + lastName, falling back to username, then the email local-part.
 * Mirrors the rule used by the password-reset email.
 */
export function approverDisplayName(user?: {
  first_name?: string | null;
  last_name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email?: string | null;
}): string {
  if (!user) return '';
  // Accept both ORM (snake_case) and domain-entity (camelCase) user shapes.
  const first = user.first_name ?? user.firstName;
  const last = user.last_name ?? user.lastName;
  const full = [first, last].filter(Boolean).join(' ').trim();
  if (full) return full;
  if (user.username) return user.username;
  return (user.email ?? '').split('@')[0] ?? '';
}
