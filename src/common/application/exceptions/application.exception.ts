export class ApplicationException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string = 'APPLICATION_ERROR',
  ) {
    super(message);
  }
}
