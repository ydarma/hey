import test from "tape";
import { hey, Shape } from "./hey";

const rangeProg = `
range(1 6 2)
`;

test("Range", (t) => {
  const result = hey(rangeProg);
  t.deepEqual(result, [1, 3, 5]);
  t.end();
});

const squareProg = `
square(3 green)
`;

test("Square", (t) => {
  const result = hey(squareProg);
  if (result instanceof Shape) {
    t.equal(result.name, "square");
    t.deepEqual(result.props, {
      size: 3,
      color: "green",
    });
  } else t.fail();
  t.end();
});

const funProg = `
(size) -> square(size green)
`;

test("User function", (t) => {
  const fun = hey(funProg);
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

const literalProg = `
12
`;

test("Literal", (t) => {
  const result = hey(literalProg);
  if (typeof result == "number") {
    t.equal(result, 12);
  } else t.fail();
  t.end();
});

const defTestProg = `
def a:
  def b: (s) -> square(s blue)
  b
a(1)
`;

test("Define", (t) => {
  const result = hey(defTestProg);
  if (result instanceof Shape) {
    t.equal(result.name, "square");
    t.deepEqual(result.props, {
      size: 1,
      color: "blue",
    });
  } else t.fail();
  t.end();
});

test("Match error", (t) => {
  t.throws(
    () => hey("square(1, black)"),
    isMatchErr("expected V<color>, got ,", 1, 9)
  );
  t.throws(
    () => hey("def Az 40\n\nsquare(1 black Az)"),
    isMatchErr("expected rpar, got A", 3, 16)
  );
  t.end();
});

test("Eval error", (t) => {
  t.throws(
    () => hey("square(\n1\ntransparent\n)"),
    isMatchErr("expected V<color>, got transparent", 3, 1)
  );
  t.throws(
    () => hey("def a (s) square(s blue) a(hey)"),
    isMatchErr("expected V<number>, got hey", 1, 18)
  );
  t.end();
});

function isMatchErr(
  msg: string,
  line: number,
  col: number
): (e: { line: number; col: number; message: string }) => boolean {
  return (e) => e.message == msg && e.line == line && e.col == col;
}
