import test from "tape";
import { Square } from "./shape";

test("Square", (t) => {
  const shape = new Square(10, "blue", 45);
  const svg = shape.toString();
  t.equal(
    svg,
    '<svg viewbox="-8 -8 15 15" style="width: 15px; height: 15px;"><rect width="10" height="10" x="-5" y="-5" fill="blue" transform="rotate(45)"></rect></svg>'
  );
  t.end();
});
