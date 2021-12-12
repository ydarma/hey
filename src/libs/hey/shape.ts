import $ from "cash-dom";

export class Shape {
  private static renderer = {
    square: (props: Record<string, number | string>): string => {
      return (
        $("<svg/>")
          .width(props.size)
          .height(props.size)
          .append(
            $("<rect/>")
              .attr("width", String(props.size))
              .attr("height", String(props.size))
              .attr("fill", String(props.color))
          )[0]?.outerHTML ?? ""
      );
    },
  };
  constructor(
    public name: "square",
    public props: Record<string, number | string>
  ) {}

  toString(): string {
    return Shape.renderer[this.name](this.props);
  }
}
