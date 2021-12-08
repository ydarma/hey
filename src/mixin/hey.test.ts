import test from "tape";
import { Shape } from "./actions";
import { hey } from "./hey";

function isError(
  msg: string,
  line: number,
  col: number
): (e: { line: number; col: number; message: string }) => boolean {
  return (e) => e.message == msg && e.line == line && e.col == col;
}

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
(size) square(size green)
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
def a
  def b(s) square(s blue)
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
    isError("expected V<color>, got ,", 1, 9)
  );
  t.throws(
    () => hey("def Az 40\n\nsquare(1 black Az)"),
    isError("expected rpar, got A", 3, 16)
  );
  t.end();
});

test("Eval error", (t) => {
  t.throws(
    () => hey("square(\n1\ntransparent\n)"),
    isError("expected V<color>, got transparent", 3, 1)
  );
  t.throws(
    () => hey("def a(s) range(s 10 2) a(hey)"),
    isError("expected identifier, got hey", 1, 26)
  );
  t.end();
});

const concatTestProg = `
c(1 c(2 3) 4)
`;

test("Concat", (t) => {
  const result = hey(concatTestProg);
  t.deepEqual(result, [1, 2, 3, 4]);
  t.end();
});

const repeatTestProg = `
r(4 blue red)
`;

test("Repeat", (t) => {
  const result = hey(repeatTestProg);
  t.deepEqual(result, ["blue", "red", "blue", "red"]);
  t.end();
});

const elemTestProg = `
def a c(1 2 3)
a(1)
`;

test("Elem", (t) => {
  const result = hey(elemTestProg);
  t.equal(result, 1);
  t.end();
});

const sequenceTestProg = `
def seq-2(x y) range(x y 2)
def seq-3(x y) range(x y 3)
c(seq-2 seq-3)(2)(3 10)
`;

test("Call sequence", (t) => {
  const result = hey(sequenceTestProg);
  t.deepEqual(result, [3, 6, 9]);
  t.end();
});

const unknownTestProg = `
def k
  def z 1
  z
z
`;

test("Unknown idetifier", (t) => {
  t.throws(
    () => hey(unknownTestProg),
    isError("expected identifier, got z", 5, 1)
  );
  t.end();
});
