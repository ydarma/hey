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
  abstract getBox(rotation: number): Box;
  abstract getTransform(): Transform;

  toString(): string {
    const { x, y, width, height } = this.getBox(0);
    const viewBox = this.getViewBox(x ?? 0, y ?? 0, width, height);
    const transformed = this.transform();
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
      .width(width)
      .height(height)
      .append(transformed);
  }

  private transform(v = vector(0, 0)) {
    const shape = this.render();
    const { dx, dy, rotation } = this.getTransform();
    const transformed = this.transformSvg(
      shape,
      rotation,
      dx ?? 0 + v("x"),
      dy ?? 0 + v("y")
    );
    return transformed;
  }

  protected transformSvg(
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

  protected t(other: Shape, vector?: Vector): Cash {
    return other.transform(vector);
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

  getBox(rotation: number): Box {
    const a = (((180 + this.rotation + rotation) % 90) * Math.PI) / 180;
    const r = Math.sqrt(2 * this.size * this.size);
    const width = Math.abs(r * Math.cos(a - Math.PI / 4));
    const height = Math.abs(r * Math.sin(a + Math.PI / 4));
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
    const { trCenter1, trCenter2 } = this.getTranslations(-this.rotation);
    return $("<g>")
      .append(super.t(this.shape1, trCenter1))
      .append(super.t(this.shape2, trCenter2));
  }

  getBox(rotation: number): Box {
    const { width, height } = this.getWH(rotation);
    const { trOrigin1, trOrigin2 } = this.getTranslations(rotation);
    return {
      x: Math.min(trOrigin1("x"), trOrigin2("x")),
      y: Math.min(trOrigin1("y"), trOrigin2("y")),
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

  private getTranslations(angle: number) {
    const t = this.rotation + angle;
    const { x: x1, y: y1, width: w1, height: h1 } = this.shape1.getBox(t);
    const { x: x2, y: y2, width: w2, height: h2 } = this.shape2.getBox(t);
    const a = w1 / (w1 + w2);
    const b = h1 / (h1 + h2);
    const r = rot(t, this.vector);
    const trCenter1 = vector(r("x") * (a - 1), r("y") * (b - 1));
    const trCenter2 = vector(r("x") * a, r("y") * b);
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

type VectorPos = Vector | "center";

function toVector(v: VectorPos): Vector {
  return isVector(v) ? v : vector(0, 0);
}
