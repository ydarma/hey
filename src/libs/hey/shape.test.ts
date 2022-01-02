import test from "tape";
import { Merge, Square } from "./shape";

test("Square", (t) => {
  const shape = new Square(10, "blue", 45);
  const svg = shape.toString();
  t.equal(
    svg,
    '<svg style="width: 14px; height: 14px;"><rect width="10" height="10" fill="blue" transform="translate(2 2) rotate(45 5 5)"></rect></svg>'
  );
  t.end();
});

test("Merge", (t) => {
  const shape1 = new Square(58, "green");
  const shape2 = new Square(40, "blue", 45);
  const shape = new Merge(shape1, shape2);
  const svg = shape.toString();
  t.equal(
    svg,
    '<svg style="width: 58px; height: 58px;"><g transform="translate(0 0) rotate(0 29 29)"><rect width="58" height="58" fill="green" transform="translate(0 0) rotate(0 29 29)"></rect><rect width="40" height="40" fill="blue" transform="translate(9 9) rotate(45 20 20)"></rect></g></svg>'
  );
  t.end();
});
