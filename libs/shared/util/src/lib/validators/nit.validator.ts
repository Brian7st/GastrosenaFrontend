export function isValidNit(value: string): boolean {
  return /^[0-9]{8,15}$/.test(value);
}
