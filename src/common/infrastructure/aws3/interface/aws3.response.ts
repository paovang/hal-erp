export class AmazonS3Response {
  public fileKey: string;
  public size: number;
  public mimeType: string;
  constructor({
    fileKey,
    size,
    mimeType,
  }: {
    fileKey: string;
    size: number;
    mimeType: string;
  }) {
    this.fileKey = fileKey;
    this.size = size;
    this.mimeType = mimeType;
  }
}
