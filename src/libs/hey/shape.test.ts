import test from "tape";
import { Composite, Square } from "./shape";
import { vector } from "./vector";

// test("Square", (t) => {
//   const shape = new Square(10, "blue", 45);
//   const svg = shape.toString();
//   t.equal(
//     svg,
//     '<svg style="width: 14px; height: 14px;"><rect width="10" height="10" fill="blue" transform="translate(2 2) rotate(45 5 5)"></rect></svg>'
//   );
//   t.end();
// });

// test("Composite", (t) => {
//   const shape1 = new Square(58, "green");
//   const shape2 = new Square(40, "blue", 45);
//   const shape = new Composite(shape1, shape2);
//   const svg = shape.toString();
//   t.equal(
//     svg,
//     '<svg style="width: 58px; height: 58px;"><g transform="translate(0 0) rotate(0 29 29)"><rect width="58" height="58" fill="green" transform="translate(0 0) rotate(0 29 29)"></rect><rect width="40" height="40" fill="blue" transform="translate(9 9) rotate(45 20 20)"></rect></g></svg>'
//   );
//   t.end();
// });

// test("Composite with translation", (t) => {
//   const shape1 = new Square(58, "green");
//   const shape2 = new Square(40, "blue", 45);
//   const shape = new Composite(shape1, shape2, vector(58, 0));
//   const svg = shape.toString();
//   t.equal(
//     svg,
//     '<svg style="width: 116px; height: 58px;"><g transform="translate(0 0) rotate(0 58 29)"><rect width="58" height="58" fill="green" transform="translate(0 0) rotate(0 29 29)"></rect><rect width="40" height="40" fill="blue" transform="translate(67 9) rotate(45 20 20)"></rect></g></svg>'
//   );
//   t.end();
// });

test("", (t) => {
  // def sq1 square(58 blue)
  // def sq2 square(38 green)
  // merge(sq1 sq2 v(58 0) 10)
  const shape1 = new Square(58, "green");
  const shape2 = new Square(38, "blue");
  const shape = new Composite(shape1, shape2, vector(58, 0), 90);
  console.log(shape.toString());
  t.end();
});
