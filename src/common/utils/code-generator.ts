export function generateNumericCode(number: number): string {
  const length = number ?? 6;

  const min = Math.pow(10, length - 1); // e.g., 100000 for 6
  const max = Math.pow(10, length) - 1; // e.g., 999999 for 6

  const code = Math.floor(Math.random() * (max - min + 1)) + min;
  return code.toString();
}
