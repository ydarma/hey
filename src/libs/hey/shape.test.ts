import test from "tape";
import { Composite, Square } from "./shape";
import { vector } from "./vector";

test("Square", (t) => {
  const shape = new Square(10, "blue", 45);
  const svg = shape.toString();
  t.ok(
    svg.includes(
      '<rect x="-5" y="-5" width="10" height="10" fill="blue" transform="translate(0 0) rotate(45)"></rect>'
    )
  );
  t.end();
});

test("Composite", (t) => {
  const shape1 = new Square(58, "green");
  const shape2 = new Square(40, "blue", 45);
  const shape = new Composite(shape1, shape2);
  const svg = shape.toString();
  t.ok(
    svg.includes(
      '<g transform="translate(0 0) rotate(0)"><rect x="-29" y="-29" width="58" height="58" fill="green" transform="translate(0 0) rotate(0)"></rect><rect x="-20" y="-20" width="40" height="40" fill="blue" transform="translate(0 0) rotate(45)"></rect></g>'
    )
  );
  t.end();
});

test("Composite with translation", (t) => {
  const shape1 = new Square(58, "green");
  const shape2 = new Square(40, "blue", 45);
  const shape = new Composite(shape1, shape2, vector(58, 0));
  const svg = shape.toString();
  t.ok(
    svg.includes(
      '<rect x="-29" y="-29" width="58" height="58" fill="green" transform="translate(-28'
    )
  );
  t.ok(
    svg.includes(
      '<rect x="-20" y="-20" width="40" height="40" fill="blue" transform="translate(29'
    )
  );
  t.end();
});

test("Composite with rotation", (t) => {
  const shape1 = new Square(58, "green");
  const shape2 = new Square(40, "blue");
  const shape = new Composite(shape1, shape2, vector(58, 0), 45);
  const svg = shape.toString();
  t.ok(svg.includes('<g transform="translate(0 0) rotate(45)">'));
  t.end();
});
