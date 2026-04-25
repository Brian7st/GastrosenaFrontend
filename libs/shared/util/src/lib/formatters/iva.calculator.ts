export function calculateIva(baseValue: number, rate: 0 | 5 | 19): number {
  return (baseValue * rate) / 100;
}
