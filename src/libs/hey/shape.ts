import $, { Cash } from "cash-dom";

export abstract class Shape {
  constructor(
    readonly name: "square",
    readonly props: Record<string, number | string>
  ) {}

  protected abstract renderer(
    svg: Cash,
    props: Record<string, string | number>
  ): string;
  protected abstract getWH(props: Record<string, string | number>): {
    w: number;
    h: number;
  };

  toString(): string {
    const wh = this.getWH(this.props);
    const width = Math.ceil(wh.w / 2);
    const height = Math.ceil(wh.h / 2);
    const viewBox = `-${width} -${height} ${wh.w} ${wh.h}`;
    const svg = $("<svg/>").attr("viewBox", viewBox).width(wh.w).height(wh.h);
    return this.renderer(svg, this.props);
  }
}

export class Square extends Shape {
  constructor(size: number, color: string, rotation = 0) {
    super("square", { size, color, rotation });
  }

  protected getWH(props: Record<string, number | string>): {
    w: number;
    h: number;
  } {
    const size = props.size as number;
    const angle = props.rotation as number;
    const a = ((45 - (angle % 90)) * Math.PI) / 180;
    const d = Math.ceil(size * Math.sqrt(2) * Math.cos(a));
    return { w: d, h: d };
  }

  protected renderer(
    svg: Cash,
    props: Record<string, number | string>
  ): string {
    return (
      svg.append(
        $("<rect/>")
          .attr("width", String(props.size))
          .attr("height", String(props.size))
          .attr("x", String(-Math.ceil((props.size as number) / 2)))
          .attr("y", String(-Math.ceil((props.size as number) / 2)))
          .attr("fill", String(props.color))
          .attr("transform", `rotate(${props.rotation})`)
      )[0]?.outerHTML ?? ""
    );
  }
}
