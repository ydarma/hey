export type Vector = (dim: "x" | "y") => number;

export function vector(x: number, y: number): Vector {
  const vect = (k: "x" | "y") => (k == "x" ? x : y);
  vect.toString = () => `(x:${x} y:${y})`;
  return vect;
}

export function add(v1: Vector, v2: Vector): Vector {
  return vector(v1("x") + v2("x"), v1("y") + v2("y"));
}

export function mul(k: number, v: Vector): Vector {
  return vector(k * v("x"), k * v("y"));
}

export function rot(alpha: number, v: Vector): Vector {
  const a = (alpha * Math.PI) / 180;
  return vector(
    v("x") * Math.cos(a) - v("y") * Math.sin(a),
    v("x") * Math.sin(a) + v("y") * Math.cos(a)
  );
}

export function isVector(o: unknown): o is Vector {
  return typeof o == "function";
}
