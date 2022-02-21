import $, { Cash } from "cash-dom";
import { add, isVector, rot, vector, Vector } from "./vector";

type Transform = {
  rotation: number;
};

function isTransform(o: unknown): o is Transform {
  if (typeof o != "object") return false;
  const b = o as Transform;
  return typeof b.rotation == "number";
}

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function isBox(o: unknown): o is Box {
  if (typeof o != "object") return false;
  const b = o as Box;
  return typeof b.width == "number" && typeof b.height == "number";
}

function rotate(shape: Cash, rotation: number) {
  const transform = shape.attr("transform") ?? "";
  return shape.attr("transform", `${transform} rotate(${-rotation})`.trim());
}

function translate(shape: Cash, trCenter: Vector) {
  const transform = shape.attr("transform") ?? "";
  return shape.attr(
    "transform",
    `${transform} translate(${trCenter.x} ${trCenter.y})`.trim()
  );
}

export abstract class Shape {
  constructor(readonly name: string, readonly rotation: number) {}

  abstract render(): Cash;
  abstract getBox(rotation: number): Box;

  toString(): string {
    const { x, y, width, height } = round4(this.getBox(0));
    const viewBox = this.getViewBox(x ?? 0, y ?? 0, width, height);
    const transformed = rotate(this.render(), this.rotation);
    const svg = this.svg(viewBox, width, height, transformed);
    return svg[0]?.outerHTML ?? "";
  }

  private getViewBox(x: number, y: number, width: number, height: number) {
    return `${x} ${y} ${width} ${height}`;
  }

  private svg(
    viewBox: string,
    width: number,
    height: number,
    transformed: Cash
  ) {
    return $("<svg>")
      .attr("viewBox", viewBox)
      .width(width + 6)
      .height(height + 6)
      .append(transformed);
  }
}

type VectorLike = Vector | "center" | "above" | "beside" | "top" | "left";

export class Composite extends Shape {
  private readonly vector: Vector;

  constructor(
    private shape1: Shape,
    private shape2: Shape,
    vect: VectorLike = "center",
    rotation = 0
  ) {
    super("composite", rotation);
    const box1 = this.shape1.getBox(0);
    const box2 = this.shape2.getBox(0);
    this.vector = toVector(vect, box1, box2);
  }

  render(): Cash {
    const { tr1, tr2 } = this.getTranslations(-this.rotation);
    return $("<g>")
      .append(
        rotate(translate(this.shape1.render(), tr1), this.shape1.rotation)
      )
      .append(
        rotate(translate(this.shape2.render(), tr2), this.shape2.rotation)
      );
  }

  getBox(rotation: number): Box {
    const { width, height } = this.getWH(rotation);
    const { origin1, origin2 } = this.getTranslations(rotation);
    return {
      x: Math.min(origin1.x, origin2.x),
      y: Math.min(origin1.y, origin2.y),
      width,
      height,
    };
  }

  private getWH(angle: number) {
    const theta = this.rotation + angle;
    const v = rot(this.vector, theta);
    const box1 = this.shape1.getBox(theta);
    const box2 = this.shape2.getBox(theta);
    const width = this.computeWidth(box1.width, box2.width, v.x);
    const height = this.computeHeight(box1.height, box2.height, -v.y);
    return { width, height };
  }

  private getTranslations(angle: number) {
    const theta = this.rotation + angle;
    const { x: x1, y: y1, width: w1, height: h1 } = this.shape1.getBox(theta);
    const { x: x2, y: y2, width: w2, height: h2 } = this.shape2.getBox(theta);
    const a = w1 / (w1 + w2);
    const b = h1 / (h1 + h2);
    const r = rot(this.vector, theta);
    const tr1 = vector(r.x * (a - 1), -r.y * (b - 1));
    const tr2 = vector(r.x * a, -r.y * b);
    const origin1 = add(vector(x1 ?? 0, y1 ?? 0), tr1);
    const origin2 = add(vector(x2 ?? 0, y2 ?? 0), tr2);
    return { tr1, tr2, origin1, origin2 };
  }

  private computeWidth(width1: number, width2: number, d: number) {
    return Math.max(width1, width2, (width1 + width2) / 2 + Math.abs(d));
  }

  private computeHeight(height1: number, height2: number, d: number) {
    return Math.max(height1, height2, (height1 + height2) / 2 + Math.abs(d));
  }
}

export class Parallelogram extends Shape {
  constructor(
    readonly base: number,
    readonly height: number,
    readonly offset: number,
    readonly color: string,
    rotation = 0
  ) {
    super("parallelogram", rotation);
    Object.defineProperty(this, "diagonals", { enumerable: false });
    Object.defineProperty(this, "sides", { enumerable: false });
  }

  readonly sides = [vector(this.base, 0), vector(this.offset, this.height)];

  readonly diagonals = [
    vector(this.offset + this.base, this.height),
    vector(this.offset - this.base, this.height),
  ];

  render(): Cash {
    const { x, y } = round4(this.getBox(-this.rotation));
    const ox = this.offset > 0 ? (x ?? 0) + this.offset : x;
    return $("<path/>")
      .attr(
        "d",
        `m ${ox} ${y} h ${this.base} ` +
          `l ${-this.offset} ${this.height} h ${-this.base} z`
      )
      .attr("fill", this.color);
  }

  getBox(rotation: number): Box {
    const theta = this.rotation + rotation;
    const d0 = rot(this.diagonals[0], theta);
    const d1 = rot(this.diagonals[1], theta);
    const { x: width, y: height } = maxAbs(d0, d1);
    return {
      x: -width / 2,
      y: -height / 2,
      width,
      height,
    };
  }

  getTransform(): Transform {
    return { rotation: -this.rotation };
  }
}

export class Square extends Shape {
  constructor(readonly size: number, readonly color: string, rotation = 0) {
    super("square", rotation);
    Object.defineProperty(this, "parallelogram", { enumerable: false });
  }

  readonly parallelogram = new Parallelogram(
    this.size,
    this.size,
    0,
    this.color,
    this.rotation
  );

  render(): Cash {
    return this.parallelogram.render();
  }

  getBox(rotation: number): Box {
    return this.parallelogram.getBox(rotation);
  }

  getTransform(): Transform {
    return this.parallelogram.getTransform();
  }
}

export class Triangle extends Shape {
  constructor(
    readonly base: number,
    readonly height: number,
    readonly offset: number,
    readonly color: string,
    rotation = 0
  ) {
    super("triangle", rotation);
    Object.defineProperty(this, "parallelogram", { enumerable: false });
    Object.defineProperty(this, "sides", { enumerable: false });
  }

  private readonly parallelogram = new Parallelogram(
    this.base,
    this.height,
    this.offset,
    this.color,
    this.rotation
  );

  readonly sides = [
    vector(this.base, 0),
    vector(this.offset, this.height),
    vector(this.offset - this.base, this.height),
  ];

  render(): Cash {
    const box = this.getWH(-this.rotation);
    if (this.offset > 0) box.x = (box.x ?? 0) + this.offset;
    const tr = this.getWH(0);
    return $("<path/>")
      .attr(
        "d",
        `m ${box.x} ${box.y} ` +
          `l ${this.base - this.offset} ${this.height} h ${-this.base} z`
      )
      .attr(
        "transform",
        `translate(${-tr.x - tr.width / 2} ${-tr.y - tr.height / 2})`
      )
      .attr("fill", this.color);
  }

  getBox(rotation: number): Box {
    const { width, height } = this.getWH(rotation);
    return {
      x: -width / 2,
      y: -height / 2,
      width,
      height,
    };
  }

  private getWH(rotation: number): Box {
    const theta = this.rotation + rotation;
    const pbox = this.parallelogram.getBox(rotation);
    const s0 = rot(this.sides[0], theta);
    const s1 = rot(this.sides[1], theta);
    const d0 = rot(this.parallelogram.diagonals[0], theta);
    const { dwidth, dheight } = this.truncParallelogram(d0, s0, s1);
    return {
      x: pbox.x - (dwidth > 0 ? 0 : dwidth),
      y: pbox.y - (dheight > 0 ? 0 : dheight),
      width: pbox.width - Math.abs(dwidth),
      height: pbox.height - Math.abs(dheight),
    };
  }

  private truncParallelogram(d: Vector, s0: Vector, s1: Vector) {
    const dwidth = this.trunc(d.x, s0.x, s1.x);
    const dheight = this.trunc(-d.y, -s0.y, -s1.y);
    return { dwidth, dheight };
  }

  private trunc(d: number, s0: number, s1: number) {
    if (d > s1 && d > s0) return Math.min(d - s0, d - s1);
    else if (d < s0 && d < s1) return Math.max(d - s0, d - s1);
    return 0;
  }

  getTransform(): Transform {
    return { rotation: -this.rotation };
  }
}

function maxAbs<T extends number | Vector>(value: T, ...others: T[]): T {
  if (isVector(value)) {
    const v = others as Vector[];
    const x = v.map((v) => v.x);
    const y = v.map((v) => v.y);
    return vector(maxAbs(value.x, ...x), maxAbs(value.y, ...y)) as T;
  }
  const n = value as number;
  const v = others as number[];
  return Math.max(Math.abs(n), ...v.map(Math.abs)) as T;
}

export function round4<T extends Box | Transform | Vector | number>(v: T): T {
  if (isVector(v)) return vector(round4(v.x), round4(v.y)) as T;
  if (isBox(v))
    return {
      x: round4(v.x),
      y: round4(v.y),
      width: round4(v.width),
      height: round4(v.height),
    } as T;
  if (isTransform(v))
    return {
      rotation: round4(v.rotation),
    } as T;
  return (Math.round((v as number) * 10000) / 10000) as T;
}

export function toVector(v: VectorLike, b1: Box, b2: Box): Vector {
  switch (v) {
    case "center":
      return vector(0, 0);
    case "above":
      return vector(0, (b1.height + b2.height) / 2);
    case "beside":
      return vector((b1.width + b2.width) / 2, 0);
    case "top":
      return vector(0, (b1.height - b2.height) / 2);
    case "left":
      return vector((b1.width - b2.width) / 2, 0);
    default:
      return v;
  }
}

export function isVectorLike(v: unknown): v is VectorLike {
  return (
    isVector(v) ||
    (typeof v == "string" &&
      ["center", "above", "beside", "top", "left"].includes(v))
  );
}
