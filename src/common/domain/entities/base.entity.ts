export class BaseEntity {
  protected id: string;
  protected createdAt: Date;
  protected updatedAt: Date;

  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public updateTimestamp(): void {
    this.updatedAt = new Date();
  }
}
