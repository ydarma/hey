import test from "tape";
import { Shape } from "./shape";

test("Square", (t) => {
  const shape = new Shape("square", { size: 1, color: "blue" });
  const svg = shape.toString();
  t.equal(svg, '<svg><rect width="1" height="1" fill="blue"></rect></svg>');
  t.end();
});
