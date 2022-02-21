export type Vector = { x: number; y: number; toString(): string };

export function vector(x: number, y: number): Vector {
  return { x, y, toString: () => `(x:${x} y:${y})` };
}

export function add(v1: Vector, v2: Vector): Vector {
  return vector(v1.x + v2.x, v1.y + v2.y);
}

export function mul(k: number, v: Vector): Vector {
  return vector(k * v.x, k * v.y);
}

export function rot(v: Vector, theta: number): Vector {
  const a = (theta * Math.PI) / 180;
  return vector(
    v.x * Math.cos(a) - v.y * Math.sin(a),
    v.x * Math.sin(a) + v.y * Math.cos(a)
  );
}

export function isVector(o: unknown): o is Vector {
  if (typeof o != "object" || !o) return false;
  for (const [k, v] of Object.entries(o)) {
    switch (k) {
      case "x":
      case "y":
        if (typeof v != "number") return false;
        break;
      case "toString":
        if (typeof v != "function") return false;
        break;
      default:
        return false;
    }
  }
  return true;
}
