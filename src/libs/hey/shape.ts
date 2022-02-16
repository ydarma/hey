import $, { Cash } from "cash-dom";
import { add, isVector, rot, toVector, vector, Vector } from "./vector";

type Transform = {
  dx?: number;
  dy?: number;
  rotation: number;
};

function isTransform(o: unknown): o is Transform {
  if (typeof o != "object") return false;
  const b = o as Transform;
  return typeof b.rotation == "number";
}

type Box = {
  x?: number;
  y?: number;
  width: number;
  height: number;
};

function isBox(o: unknown): o is Box {
  if (typeof o != "object") return false;
  const b = o as Box;
  return typeof b.width == "number" && typeof b.height == "number";
}

export abstract class Shape {
  constructor(readonly name: string) {}

  abstract render(): Cash;
  abstract getBox(rotation: number): Box;
  abstract getTransform(): Transform;

  toString(): string {
    const { x, y, width, height } = round4(this.getBox(0));
    const viewBox = this.getViewBox(x ?? 0, y ?? 0, width, height);
    const transformed = this.transform(vector(0, 0));
    const svg = this.svg(viewBox, width, height, transformed);
    return svg[0]?.outerHTML ?? "";
  }

  private getViewBox(x: number, y: number, width: number, height: number) {
    return `${x - 3} ${y - 3} ${width + 6} ${height + 6}`;
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

  private transform(v: Vector) {
    const shape = this.render();
    const { dx, dy, rotation } = round4(this.getTransform());
    const transformed = this.transformSvg(
      shape,
      rotation,
      dx ?? 0 + v.x,
      dy ?? 0 + v.y
    );
    return transformed;
  }

  protected transformSvg(
    shape: Cash,
    rotation: number,
    dx: number,
    dy: number
  ): Cash {
    const tr = shape.attr("transform") ?? "";
    return shape.attr(
      "transform",
      `${tr} translate(${dx} ${dy}) rotate(${rotation})`.trim()
    );
  }

  protected t(other: Shape, vect?: Vector): Cash {
    return other.transform(vect ? round4(vect) : vector(0, 0));
  }
}

export class Composite extends Shape {
  private readonly vector: Vector;

  constructor(
    private shape1: Shape,
    private shape2: Shape,
    vect: Vector | "center" = "center",
    private rotation = 0
  ) {
    super("composite");
    this.vector = toVector(vect);
  }

  render(): Cash {
    const { trCenter1, trCenter2 } = this.getTranslations(-this.rotation);
    return $("<g>")
      .append(super.t(this.shape1, trCenter1))
      .append(super.t(this.shape2, trCenter2));
  }

  getBox(rotation: number): Box {
    const { width, height } = this.getWH(rotation);
    const { trOrigin1, trOrigin2 } = this.getTranslations(rotation);
    return {
      x: Math.min(trOrigin1.x, trOrigin2.x),
      y: Math.min(trOrigin1.y, trOrigin2.y),
      width,
      height,
    };
  }

  getTransform(): Transform {
    return { rotation: -this.rotation };
  }

  private getWH(angle: number) {
    const theta = this.rotation + angle;
    const v = rot(this.vector, theta);
    const box1 = this.shape1.getBox(theta);
    const box2 = this.shape2.getBox(theta);
    const width = this.computeWidth(box1.width, box2.width, v.x);
    const height = this.computeHeight(box1.height, box2.height, v.y);
    return { width, height };
  }

  private getTranslations(angle: number) {
    const theta = this.rotation + angle;
    const { x: x1, y: y1, width: w1, height: h1 } = this.shape1.getBox(theta);
    const { x: x2, y: y2, width: w2, height: h2 } = this.shape2.getBox(theta);
    const a = w1 / (w1 + w2);
    const b = h1 / (h1 + h2);
    const r = rot(this.vector, theta);
    const trCenter1 = vector(r.x * (a - 1), r.y * (b - 1));
    const trCenter2 = vector(r.x * a, r.y * b);
    const trOrigin1 = add(vector(x1 ?? 0, y1 ?? 0), trCenter1);
    const trOrigin2 = add(vector(x2 ?? 0, y2 ?? 0), trCenter2);
    return { trCenter1, trCenter2, trOrigin1, trOrigin2 };
  }

  private computeWidth(width1: number, width2: number, d: number) {
    return Math.max(width1, width2, (width1 + width2) / 2 + Math.abs(d));
  }

  private computeHeight(height1: number, height2: number, d: number) {
    return Math.max(height1, height2, (height1 + height2) / 2 + Math.abs(d));
  }
}

export class Triangle extends Shape {
  constructor(
    private base: number,
    private height: number,
    private offset: number,
    private color: string,
    private rotation = 0
  ) {
    super("triangle");
  }

  render(): Cash {
    const box = round4(this.getBox(-this.rotation));
    if (this.offset > 0) box.x = (box.x ?? 0) + this.offset;
    return $("<path/>")
      .attr(
        "d",
        `m ${box.x} ${box.y} ` +
          `l ${this.base - this.offset} ${this.height} h ${-this.base} z`
      )
      .attr("fill", this.color);
  }

  getBox(rotation: number): Box {
    const theta = this.rotation + rotation;
    const side1 = rot(vector(this.base, 0), theta);
    const side2 = rot(vector(this.offset, this.height), theta);
    const side3 = rot(vector(this.offset - this.base, this.height), theta);
    const { x: width, y: height } = maxAbs(side1, side2, side3);
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

export class Parallelogram extends Shape {
  constructor(
    private base: number,
    private height: number,
    private offset: number,
    private color: string,
    private rotation = 0
  ) {
    super("parallelogram");
  }

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
    const diagonal1 = rot(
      vector(this.offset + this.base, this.height),
      this.rotation + rotation
    );
    const diagonal2 = rot(
      vector(this.offset - this.base, this.height),
      this.rotation + rotation
    );
    const { x: width, y: height } = maxAbs(diagonal1, diagonal2);
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
  private readonly parallelogram;
  constructor(
    private size: number,
    private color: string,
    private rotation = 0
  ) {
    super("square");
    this.parallelogram = new Parallelogram(size, size, 0, color, rotation);
    Object.defineProperty(this, "parallelogram", { enumerable: false });
  }

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
      ...(v.x ? { x: round4(v.x) } : {}),
      ...(v.y ? { y: round4(v.y) } : {}),
      width: round4(v.width),
      height: round4(v.height),
    } as T;
  if (isTransform(v))
    return {
      ...(v.dx ? { dx: round4(v.dx) } : {}),
      ...(v.dy ? { dy: round4(v.dy) } : {}),
      rotation: round4(v.rotation),
    } as T;
  return (Math.round((v as number) * 10000) / 10000) as T;
}
