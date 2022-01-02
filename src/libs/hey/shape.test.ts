import test from "tape";
import { Square } from "./shape";

test("Square", (t) => {
  const shape = new Square(10, "blue", 45);
  const svg = shape.toString();
  t.equal(
    svg,
    '<svg style="width: 15px; height: 15px;"><rect width="10" height="10" fill="blue" transform="translate(3 3) rotate(45 5 5)"></rect></svg>'
  );
  t.end();
});
