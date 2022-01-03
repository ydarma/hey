import $, { Cash } from "cash-dom";
import { isVector, mul, vector, Vector } from "./vector";

type ShapeProps = {
  width: number;
  height: number;
  rotation: number;
};

type ShapeName = "square" | "composite";

export abstract class Shape {
  constructor(readonly name: ShapeName, readonly props: ShapeProps) {}

  protected abstract render(): Cash;

  toString(): string {
    const { width, height, transformed } = this.t();
    const viewBox = `-${Math.round(width / 2)} -${Math.round(
      height / 2
    )} ${width} ${height}`;
    const svg = $("<svg>")
      .attr("viewBox", viewBox)
      .width(width)
      .height(height)
      .append(transformed);
    return svg[0]?.outerHTML ?? "";
  }

  private t(tx = 0, ty = 0) {
    const shape = this.render();
    const { width, height } = getBox(this.props);
    const { dx, dy } = getTransform(this.props);
    const transformed = this.transform(shape, dx, dy, tx, ty);
    return { width, height, transformed };
  }

  protected transform(
    shape: Cash,
    dx: number,
    dy: number,
    tx: number,
    ty: number
  ): Cash {
    return shape.attr(
      "transform",
      `translate(${-dx + tx} ${-dy + ty}) rotate(${
        this.props.rotation
      } ${dx} ${dy})`
    );
  }

  protected r(other: Shape, vector?: Vector): Cash {
    const { transformed } = other.t(vector?.("x"), vector?.("y"));
    return transformed;
  }
}

export class Square extends Shape {
  constructor(private size: number, private color: string, rotation = 0) {
    super("square", { width: size, height: size, rotation });
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
    rotation = 0
  ) {
    super("composite", {
      width: computeWidth(
        getBox(shape1.props).width,
        getBox(shape2.props).width,
        vect
      ),
      height: computeHeight(
        getBox(shape1.props).height,
        getBox(shape2.props).height,
        vect
      ),
      rotation,
    });
    this.vector = isVector(vect) ? vect : vector(0, 0);
  }

  protected render(): Cash {
    const v1 = mul(-0.5, this.vector);
    const v2 = mul(0.5, this.vector);
    return $("<g>")
      .append(super.r(this.shape1, v1))
      .append(super.r(this.shape2, v2));
  }
  protected transform(
    shape: Cash,
    dx: number,
    dy: number,
    tx: number,
    ty: number
  ): Cash {
    return super.transform(shape, 0, 0, tx, ty);
  }
}

function getTransform(props: ShapeProps) {
  const dx = Math.round(props.width / 2);
  const dy = Math.round(props.height / 2);
  return { dx, dy };
}

function getBox(props: ShapeProps): {
  width: number;
  height: number;
  a: number;
} {
  const o = Math.atan(props.height / props.width);
  const a = (props.rotation * Math.PI) / 180;
  const r = Math.sqrt(props.height * props.height + props.width * props.width);
  const width = Math.abs(Math.round(r * Math.cos(a - o)));
  const height = Math.abs(Math.round(r * Math.sin(a + o)));
  return { width, height, a };
}

function computeWidth(width1: number, width2: number, vect: Vector | "center") {
  return Math.max(
    width1,
    width2,
    Math.round((width1 + width2) / 2) + (isVector(vect) ? vect("x") : 0)
  );
}

type VectorPos = Vector | "center";

function computeHeight(height1: number, height2: number, vect: VectorPos) {
  return Math.max(
    height1,
    height2,
    Math.round((height1 + height2) / 2) + (isVector(vect) ? vect("y") : 0)
  );
}
