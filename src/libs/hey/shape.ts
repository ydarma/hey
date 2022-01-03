import $, { Cash } from "cash-dom";
import { add, isVector, mul, rot, vector, Vector } from "./vector";

export abstract class Shape {
  constructor(readonly name: string) {}

  protected abstract render(): Cash;
  abstract getBox(t: number): { width: number; height: number };
  abstract getTransform(): {
    dx: number;
    dy: number;
    cx: number;
    cy: number;
    rotation: number;
  };

  toString(): string {
    const { width, height, transformed } = this.t();
    const w = Math.ceil(width / 2);
    const h = Math.ceil(height / 2);
    const viewBox = `-${w} -${h} ${w * 2} ${h * 2}`;
    const svg = $("<svg>")
      .attr("viewBox", viewBox)
      .width(width)
      .height(height)
      .append(transformed);
    return svg[0]?.outerHTML ?? "";
  }

  private t(tx = 0, ty = 0) {
    const shape = this.render();
    const { width, height } = this.getBox(0);
    const { dx, dy, cx, cy, rotation } = this.getTransform();
    const transformed = this.transform(
      shape,
      rotation,
      dx - tx,
      dy - ty,
      cx,
      cy
    );
    return { width, height, transformed };
  }

  protected transform(
    shape: Cash,
    rotation: number,
    dx: number,
    dy: number,
    cx: number,
    cy: number
  ): Cash {
    return shape.attr(
      "transform",
      `translate(${-Math.round(dx)} ${-Math.round(
        dy
      )}) rotate(${rotation} ${Math.round(cx)} ${Math.round(cy)})`
    );
  }

  protected r(other: Shape, vector?: Vector): Cash {
    const { transformed } = other.t(vector?.("x"), vector?.("y"));
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

  getBox(t: number): {
    width: number;
    height: number;
    a: number;
  } {
    const o = Math.atan(this.size / this.size);
    const a = ((this.rotation + t) * Math.PI) / 180;
    const r = Math.sqrt(2 * this.size * this.size);
    const width = Math.abs(r * Math.cos(a - o));
    const height = Math.abs(r * Math.sin(a + o));
    return { width, height, a };
  }

  getTransform(): {
    dx: number;
    dy: number;
    cx: number;
    cy: number;
    rotation: number;
  } {
    const dx = this.size / 2;
    const dy = this.size / 2;
    return { dx, dy, cx: dx, cy: dy, rotation: this.rotation };
  }

  protected render(): Cash {
    return $("<rect/>")
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
    const { width: w1, height: h1 } = this.shape1.getBox(0);
    const { width: w2, height: h2 } = this.shape2.getBox(0);
    const { width, height } = this.getBox(0);
    const dw1 = (w1 - width) / 2;
    const dh1 = (h1 - height) / 2;
    const dw2 = (width - w2) / 2;
    const dh2 = (height - h2) / 2;
    const t1 = vector(
      w1 > w2 ? dw1 : dw2 - this.vector("x"),
      h1 > h2 ? dh1 : dh2 - this.vector("y")
    );
    const t2 = vector(
      w1 > w2 ? dw1 + this.vector("x") : dw2,
      h1 > h2 ? dh1 + this.vector("y") : dh2
    );
    return $("<g>")
      .append(super.r(this.shape1, t1))
      .append(super.r(this.shape2, t2));
  }

  getTransform(): {
    dx: number;
    dy: number;
    cx: number;
    cy: number;
    rotation: number;
  } {
    return {
      dx: 0,
      dy: 0,
      cx: 0,
      cy: 0,
      rotation: this.rotation,
    };
  }

  getBox(t: number): { width: number; height: number } {
    return {
      width: computeWidth(
        this.shape1.getBox(this.rotation + t).width,
        this.shape2.getBox(this.rotation + t).width,
        rot(this.rotation + t, this.vector)("x")
      ),
      height: computeHeight(
        this.shape1.getBox(this.rotation + t).height,
        this.shape2.getBox(this.rotation + t).height,
        rot(this.rotation + t, this.vector)("y")
      ),
    };
  }
}

function computeWidth(width1: number, width2: number, d: number) {
  return Math.max(width1, width2, (width1 + width2) / 2 + Math.abs(d));
}

type VectorPos = Vector | "center";

function computeHeight(height1: number, height2: number, d: number) {
  return Math.max(height1, height2, (height1 + height2) / 2 + Math.abs(d));
}

function toVector(v: VectorPos): Vector {
  return isVector(v) ? v : vector(0, 0);
}
