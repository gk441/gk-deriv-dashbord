export function evenOddBot(number) {
  return number % 2 === 0 ? 'Even' : 'Odd';
}

export function riseFallBot(prev, current) {
  return current > prev ? 'Rise' : 'Fall';
}

export function matchesDiffersBot(val1, val2) {
  return val1 === val2 ? 'Matches' : 'Differs';
}

export function overUnderBot(value, threshold) {
  return value > threshold ? 'Over' : 'Under';
}