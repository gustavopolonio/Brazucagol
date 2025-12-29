export function nearestPowerOfTwoCeil(number: number) {
  return Math.pow(2, Math.ceil(Math.log2(number)));
}

export function isPowerOfTwo(number: number) {
  if (number <= 0) return false;

  while (number % 2 === 0) {
    number = number / 2;
  }

  return number === 1;
}
