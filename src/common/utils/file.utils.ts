import { unlink } from 'fs/promises';

export async function deleteFile(filePath: string): Promise<any> {
  try {
    return await unlink(filePath);
  } catch (error) {
    const errMsg = `Failed to delete file: ${filePath}. Error: ${error}`;
    console.error(errMsg);
    return errMsg;
  }
}
