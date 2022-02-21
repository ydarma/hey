import test from "tape";
import { Composite, Parallelogram, round4, Square } from "./shape";
import { vector } from "./vector";

test("Square", (t) => {
  const shape = new Square(10, "blue", 45);
  const svg = shape.toString();
  t.ok(svg.includes('<path d="m -5 -5 h 10 l 0 10 h -10 z" fill="blue"'));
  t.end();
});

test("Composite", (t) => {
  const shape1 = new Square(58, "green");
  const shape2 = new Square(40, "blue", 45);
  const shape = new Composite(shape1, shape2);
  const svg = shape.toString();
  t.ok(
    svg.includes(
      '<g transform="rotate(0)"><path d="m -29 -29 h 58 l 0 58 h -58 z" fill="green" transform="translate(0 0) rotate(0)"></path><path d="m -20 -20 h 40 l 0 40 h -40 z" fill="blue" transform="translate(0 0) rotate(-45)"></path></g>'
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
      '<path d="m -29 -29 h 58 l 0 58 h -58 z" fill="green" transform="translate(-2'
    )
  );
  t.ok(
    svg.includes(
      '<path d="m -20 -20 h 40 l 0 40 h -40 z" fill="blue" transform="translate(2'
    )
  );
  t.end();
});

test("Composite with rotation", (t) => {
  const shape1 = new Square(58, "green");
  const shape2 = new Square(40, "blue");
  const shape = new Composite(shape1, shape2, vector(58, 0), 45);
  const svg = shape.toString();
  t.ok(svg.includes('<g transform="rotate(-45)">'));
  t.end();
});

test("Parallelogram", (t) => {
  const parallelogram = new Parallelogram(30, 15, 10, "green");
  const svg = parallelogram.toString();
  t.ok(svg.includes('<path d="m -10 -7.5 h 30 l -10 15 h -30 z" fill="green"'));
  t.end();
});

test("Parallelogram box", (t) => {
  const parallelogram = new Parallelogram(30, 15, 10, "green", -35);
  const box1 = parallelogram.getBox(0);
  t.deepLooseEqual(round4(box1), {
    x: -20.6849,
    y: -11.8794,
    width: 41.3697,
    height: 23.7588,
  });
  const box2 = parallelogram.getBox(135);
  t.deepLooseEqual(round4(box2), {
    x: -10.859,
    y: -18.3938,
    width: 21.718,
    height: 36.7876,
  });
  t.end();
});
