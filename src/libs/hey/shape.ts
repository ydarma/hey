import $, { Cash } from "cash-dom";

type ShapeProps = Record<string, number | string> & {
  width: number;
  height: number;
  rotation: number;
  color: string;
};

export abstract class Shape {
  constructor(readonly name: "square", readonly props: ShapeProps) {}

  protected abstract renderer(props: Record<string, string | number>): Cash;

  protected getBox(props: ShapeProps): {
    width: number;
    height: number;
  } {
    const a = ((45 - (props.rotation % 90)) * Math.PI) / 180;
    const width = Math.ceil(props.width * Math.sqrt(2) * Math.cos(a));
    const height = Math.ceil(props.height * Math.sqrt(2) * Math.cos(a));
    return { width, height };
  }

  private getTransform(width: number, height: number) {
    const dx = Math.ceil((width - this.props.width) / 2);
    const dy = Math.ceil((height - this.props.height) / 2);
    const cx = Math.ceil(this.props.width / 2);
    const cy = Math.ceil(this.props.height / 2);
    return { dx, dy, cx, cy };
  }

  toString(): string {
    const shape = this.renderer(this.props);
    const { width, height } = this.getBox(this.props);
    const { dx, dy, cx, cy } = this.getTransform(width, height);
    const svg = this.getSvg(width, height, shape, dx, dy, cx, cy);
    return svg[0]?.outerHTML ?? "";
  }

  private getSvg(
    width: number,
    height: number,
    shape: Cash,
    dx: number,
    dy: number,
    cx: number,
    cy: number
  ) {
    return $("<svg/>")
      .width(width)
      .height(height)
      .append(
        shape.attr(
          "transform",
          `translate(${dx} ${dy}) rotate(${this.props.rotation} ${cx} ${cy})`
        )
      );
  }
}

export class Square extends Shape {
  constructor(size: number, color: string, rotation = 0) {
    super("square", { size, width: size, height: size, color, rotation });
  }

  protected renderer(props: Record<string, number | string>): Cash {
    return $("<rect/>")
      .attr("width", String(props.size))
      .attr("height", String(props.size))
      .attr("fill", String(props.color));
  }
}
