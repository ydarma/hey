import test from "tape";
import { Shape } from "./shape";

test("Square", (t) => {
  const shape = new Shape("square", { size: 1, color: "blue" });
  const svg = shape.toString();
  t.true(svg.includes('<rect width="1" height="1" fill="blue"></rect>'));
  t.end();
});
