// import { Injectable } from '@nestjs/common';
// import { randomBytes } from 'crypto';

// @Injectable()
// export class CodeGenerateUtil {
//   /**
//    * Generates the next sequential code by incrementing a counter until uniqueness is satisfied.
//    * Note: This is simple but not concurrency-safe by itself. For high traffic, prefer getNextNumber + formatNumericCode.
//    *
//    * @param length Digits for the numeric portion (e.g., 4 => 0001)
//    * @param checkUniqueness Async function that returns true if the code does NOT already exist
//    * @param prefix Optional prefix (e.g., 'DT' -> 'DT-0001')
//    * @param startAt First number to try (default 1)
//    */
//   async generateSequentialUniqueCode(
//     length: number,
//     checkUniqueness: (code: string) => Promise<boolean>,
//     prefix?: string,
//     startAt = 1,
//   ): Promise<string> {
//     let n = Math.max(0, startAt - 1);

//     // Try next numbers until we find a free code
//     while (true) {
//       n += 1;
//       const candidate = this.formatNumericCode(n, length, prefix);
//       if (await checkUniqueness(candidate)) {
//         return candidate;
//       }
//       // Loop continues until a unique code is found
//     }
//   }

//   /**
//    * Formats a number as zero-padded string with optional prefix.
//    * Example: formatNumericCode(12, 4, 'DT') => 'DT-0012'
//    */
//   formatNumericCode(n: number, length: number, prefix?: string): string {
//     const numeric = Math.max(0, Math.floor(n)).toString().padStart(length, '0');
//     return prefix ? `${prefix}-${numeric}` : numeric;
//   }

//   /**
//    * Optional: random numeric string (digits only), zero-padded length.
//    * If you just need numbers (not sequential) like '0384', '9271', etc.
//    */
//   generateRandomDigits(length: number): string {
//     const bytes = randomBytes(length);
//     let out = '';
//     for (let i = 0; i < length; i++) {
//       out += (bytes[i] % 10).toString();
//     }
//     return out;
//   }
// }
