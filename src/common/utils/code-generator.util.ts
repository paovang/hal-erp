import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class CodeGeneratorUtil {
  /**
   * Generates a unique code with optional prefix
   * @param length The length of the random part of the code (excluding prefix)
   * @param checkUniqueness Function to check if the generated code already exists
   * @param prefix Optional prefix to add to the code (e.g., 'DT')
   * @returns A promise that resolves to a unique code
   */
  async generateUniqueCode(
    length: number,
    checkUniqueness: (code: string) => Promise<boolean>,
    prefix?: string,
  ): Promise<string> {
    let isUnique = false;
    let code = '';
    let fullCode = '';

    while (!isUnique) {
      // Generate random alphanumeric code with the specified length
      code = this.generateRandomCode(length);

      // Add prefix if provided
      fullCode = prefix ? `${prefix}-${code}` : code;

      // Check uniqueness
      isUnique = await checkUniqueness(fullCode);
    }

    return fullCode;
  }

  /**
   * Generates a random alphanumeric code of specified length
   * @param length The length of the code to generate
   * @returns A random uppercase alphanumeric code
   */
  private generateRandomCode(length: number): string {
    // Calculate how many bytes we need for the specified length
    // Each byte gives us 2 hex characters
    const bytesNeeded = Math.ceil(length / 2);

    return randomBytes(bytesNeeded)
      .toString('hex')
      .toUpperCase()
      .substring(0, length);
  }

  async generateSequentialUniqueCode(
    length: number,
    checkUniqueness: (code: string) => Promise<boolean>,
    prefix?: string,
    startAt = 1,
  ): Promise<string> {
    let n = Math.max(0, startAt - 1);

    // Try next numbers until we find a free code
    while (true) {
      n += 1;
      const candidate = this.formatNumericCode(n, length, prefix);
      if (await checkUniqueness(candidate)) {
        return candidate;
      }
      // Loop continues until a unique code is found
    }
  }

  /**
   * Formats a number as zero-padded string with optional prefix.
   * Example: formatNumericCode(12, 4, 'DT') => 'DT-0012'
   */
  formatNumericCode(n: number, length: number, prefix?: string): string {
    const numeric = Math.max(0, Math.floor(n)).toString().padStart(length, '0');
    return prefix ? `${prefix}-${numeric}` : numeric;
  }

  /**
   * Optional: random numeric string (digits only), zero-padded length.
   * If you just need numbers (not sequential) like '0384', '9271', etc.
   */
  generateRandomDigits(length: number): string {
    const bytes = randomBytes(length);
    let out = '';
    for (let i = 0; i < length; i++) {
      out += (bytes[i] % 10).toString();
    }
    return out;
  }
}
