export function isValidCufe(value: string): boolean {
  return /^[a-fA-F0-9]{64}$/.test(value);
}
