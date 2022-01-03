export type Vector = (dim: "x" | "y") => number;

export function vector(x: number, y: number): Vector {
  const vect = (k: "x" | "y") => (k == "x" ? x : y);
  vect.toString = () => `(x:${x} y:${y})`;
  return vect;
}
