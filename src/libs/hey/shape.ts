import $, { Cash } from "cash-dom";
import { add, isVector, rot, vector, Vector } from "./vector";

type Transform = {
  dx?: number;
  dy?: number;
  rotation: number;
};

type Box = {
  x?: number;
  y?: number;
  width: number;
  height: number;
};

export abstract class Shape {
  constructor(readonly name: string) {}

  protected abstract render(): Cash;
  abstract getBox(t: number): Box;
  abstract getTransform(): Transform;

  toString(): string {
    const { x, y, width, height, transformed } = this.t();
    const viewBox = this.getViewBox(x ?? 0, y ?? 0, width, height);
    const svg = $("<svg>")
      .attr("viewBox", viewBox)
      .width(width)
      .height(height)
      .append(transformed);
    return svg[0]?.outerHTML ?? "";
  }

  private getViewBox(x: number, y: number, width: number, height: number) {
    return `${x} ${y} ${width} ${height}`;
  }

  private t(v = vector(0, 0)) {
    const shape = this.render();
    const { x, y, width, height } = this.getBox(0);
    const { dx, dy, rotation } = this.getTransform();
    const transformed = this.transform(
      shape,
      rotation,
      dx ?? 0 + v("x"),
      dy ?? 0 + v("y")
    );
    return { x, y, width, height, transformed };
  }

  protected transform(
    shape: Cash,
    rotation: number,
    dx: number,
    dy: number
  ): Cash {
    return shape.attr(
      "transform",
      `translate(${dx} ${dy}) rotate(${rotation})`
    );
  }

  protected r(other: Shape, vector?: Vector): Cash {
    const { transformed } = other.t(vector);
    return transformed;
  }
}

export class Square extends Shape {
  constructor(
    private size: number,
    private color: string,
    private rotation = 0
  ) {
    super("square");
  }

  getBox(t: number): Box {
    const o = Math.atan(this.size / this.size);
    const a = (((180 + this.rotation + t) % 90) * Math.PI) / 180;
    const r = Math.sqrt(2 * this.size * this.size);
    const width = Math.abs(r * Math.cos(a - o));
    const height = Math.abs(r * Math.sin(a + o));
    return {
      x: -width / 2,
      y: -height / 2,
      width,
      height,
    };
  }

  getTransform(): Transform {
    return { rotation: this.rotation };
  }

  protected render(): Cash {
    return $("<rect/>")
      .attr("x", String(-this.size / 2))
      .attr("y", String(-this.size / 2))
      .attr("width", String(this.size))
      .attr("height", String(this.size))
      .attr("fill", String(this.color));
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

  protected render(): Cash {
    const wh = this.getWH(-this.rotation);
    const { t1, t2 } = this.getTranslations(wh, -this.rotation);
    return $("<g>")
      .append(super.r(this.shape1, t1))
      .append(super.r(this.shape2, t2));
  }

  getBox(t: number): Box {
    const { width, height } = this.getWH(t);
    const { tb1, tb2 } = this.getTranslations({ width, height }, t);
    return {
      x: Math.min(tb1("x"), tb2("x")),
      y: Math.min(tb1("y"), tb2("y")),
      width,
      height,
    };
  }

  getTransform(): Transform {
    return { rotation: this.rotation };
  }

  private getWH(angle: number) {
    const t = this.rotation + angle;
    const v = rot(t, this.vector);
    const box1 = this.shape1.getBox(t);
    const box2 = this.shape2.getBox(t);
    const width = this.computeWidth(box1.width, box2.width, v("x"));
    const height = this.computeHeight(box1.height, box2.height, v("y"));
    return { width, height };
  }

  private getTranslations({ width, height }: Box, angle: number) {
    const t = this.rotation + angle;
    const { x: x1, y: y1, width: w1, height: h1 } = this.shape1.getBox(t);
    const dw1 = (w1 - width) / 2;
    const dh1 = (h1 - height) / 2;
    const { x: x2, y: y2, width: w2, height: h2 } = this.shape2.getBox(t);
    const dw2 = (width - w2) / 2;
    const dh2 = (height - h2) / 2;
    const r = rot(t, this.vector);
    const t1 = vector(
      w1 > w2 ? dw1 : dw2 - r("x"),
      h1 > h2 ? dh1 : dh2 - r("y")
    );
    const t2 = vector(
      w1 > w2 ? dw1 + r("x") : dw2,
      h1 > h2 ? dh1 + r("y") : dh2
    );
    const tb1 = add(vector(x1 ?? 0, y1 ?? 0), t1);
    const tb2 = add(vector(x2 ?? 0, y2 ?? 0), t2);
    return { t1, t2, tb1, tb2 };
  }

  private computeWidth(width1: number, width2: number, d: number) {
    return Math.max(width1, width2, (width1 + width2) / 2 + Math.abs(d));
  }

  private computeHeight(height1: number, height2: number, d: number) {
    return Math.max(height1, height2, (height1 + height2) / 2 + Math.abs(d));
  }
}

type VectorPos = Vector | "center";

function toVector(v: VectorPos): Vector {
  return isVector(v) ? v : vector(0, 0);
}
