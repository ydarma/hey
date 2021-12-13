export function b(n: number): [number, number] {
  if (n == 0) return [1, 1];

  const ix = index(n);
  const bb = ix.map((p) => b(p));
  const fx = ix.map((p) => comb(p, n + 1));

  const terms = bb.map((nb, i) => [nb[0] * fx[i], nb[1]]);
  const sum = terms.reduce((a, b) =>
    reduce([a[0] * b[1] + b[0] * a[1], a[1] * b[1]])
  );
  return reduce([-sum[0], sum[1] * (n + 1)]);
}

function reduce([numerator, denominator]: [number, number]): [number, number] {
  let a = numerator;
  let b = denominator;
  let c;
  while (b) {
    c = a % b;
    a = b;
    b = c;
  }
  numerator /= a;
  denominator /= a;
  return denominator > 0
    ? [numerator, denominator]
    : [-numerator, -denominator];
}

function index(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

export function comb(p: number, n: number): number {
  p = p > n / 2 ? n - p : p;
  let numer = 1;
  let denom = 1;
  for (let i = 0; i < p; ++i) {
    numer *= n - i;
    denom *= i + 1;
  }
  return numer / denom;
}
