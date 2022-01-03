export type Vector = (dim: "x" | "y") => number;

export function vector(x: number, y: number): Vector {
  const vect = (k: "x" | "y") => (k == "x" ? x : y);
  vect.toString = () => `(x:${x} y:${y})`;
  return vect;
}

export function add(v1: Vector, v2: Vector): Vector {
  return vector(v1("x") + v2("x"), v1("y") + v2("y"));
}

export function mul(k: number, v2: Vector): Vector {
  return vector(k * v2("x"), k * v2("y"));
}

export function isVector(o: unknown): o is Vector {
  return typeof o == "function";
}
