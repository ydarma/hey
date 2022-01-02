import $, { Cash } from "cash-dom";

type ShapeProps = {
  width: number;
  height: number;
  rotation: number;
};

export abstract class Shape {
  constructor(readonly name: "square" | "merge", readonly props: ShapeProps) {}

  protected abstract render(): Cash;

  protected getBox(): {
    width: number;
    height: number;
  } {
    const a = ((45 - (this.props.rotation % 90)) * Math.PI) / 180;
    const width = Math.round(this.props.width * Math.sqrt(2) * Math.cos(a));
    const height = Math.round(this.props.height * Math.sqrt(2) * Math.cos(a));
    return { width, height };
  }

  private getTransform(width: number, height: number) {
    const dx = Math.round((width - this.props.width) / 2);
    const dy = Math.round((height - this.props.height) / 2);
    const cx = Math.round(this.props.width / 2);
    const cy = Math.round(this.props.height / 2);
    return { dx, dy, cx, cy };
  }

  toString(): string {
    const { width, height, transformed } = this.t();
    const svg = $("<svg>").width(width).height(height).append(transformed);
    return svg[0]?.outerHTML ?? "";
  }

  private t() {
    const shape = this.render();
    const { width, height } = this.getBox();
    const { dx, dy, cx, cy } = this.getTransform(width, height);
    const transformed = this.transform(shape, dx, dy, cx, cy);
    return { width, height, transformed };
  }

  private transform(
    shape: Cash,
    dx: number,
    dy: number,
    cx: number,
    cy: number
  ) {
    return shape.attr(
      "transform",
      `translate(${dx} ${dy}) rotate(${this.props.rotation} ${cx} ${cy})`
    );
  }

  protected r(other: Shape): Cash {
    const { transformed } = other.t();
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

export class Merge extends Shape {
  constructor(
    private shape1: Shape,
    private shape2: Shape,
    private vector = "center",
    rotation = 0
  ) {
    super("merge", {
      width: Math.max(shape1.props.width, shape2.props.width),
      height: Math.max(shape1.props.height, shape2.props.height),
      rotation,
    });
  }

  protected render(): Cash {
    return $("<g>").append(super.r(this.shape1)).append(super.r(this.shape2));
  }
}
