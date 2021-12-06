import test from "tape";
import { hey, Shape } from "./hey";

test("Range", (t) => {
  const result = hey("range(1 6 2)");
  t.deepEqual(result, [1, 3, 5]);
  t.end();
});

test("Square", (t) => {
  const result = hey("square(3 green)");
  if (result instanceof Shape) {
    t.equal(result.name, "square");
    t.deepEqual(result.props, {
      size: 3,
      color: "green",
    });
  } else t.fail();
  t.end();
});

test("User function", (t) => {
  const fun = hey("(size) -> square(size green)");
  if (typeof fun == "function") {
    const result = fun(3);
    t.equal(result.name, "square");
    t.deepEqual(result.props, {
      size: 3,
      color: "green",
    });
  } else t.fail();
  t.end();
});

test("Literal", (t) => {
  const result = hey("12");
  if (typeof result == "number") {
    t.equal(result, 12);
  } else t.fail();
  t.end();
});

const defTestHey = `
def a:
  def b: (s) -> square(s blue)
  b(1)
a
`;

test("Define", (t) => {
  const result = hey(defTestHey);
  if (result instanceof Shape) {
    t.equal(result.name, "square");
    t.deepEqual(result.props, {
      size: 1,
      color: "blue",
    });
  } else t.fail();
  t.end();
});
