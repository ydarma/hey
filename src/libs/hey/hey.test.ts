import test from "tape";
import { Shape } from "./shape";
import fs from "fs";
import path from "path";
import { heyLoader } from "./hey";
import { HeyError } from ".";

function localLoader() {
  const heyFile = path.join(__dirname, "../../../public/hey.ohm");
  return fs.readFileSync(heyFile).toString();
}

const { hey, cancel } = heyLoader(localLoader);

function isError(
  msg: string,
  line: number,
  col: number
): (e: { line: number; col: number; message: string }) => boolean {
  return (e) => e.message == msg && e.line == line && e.col == col;
}

const rangeProg = `
range(3 1 2)
`;

test("Range", async (t) => {
  const result = await hey(rangeProg);
  t.deepEqual(result, [1, 3, 5]);
  t.end();
});

const squareProg = `
square(3 green)
`;

test("Square", async (t) => {
  const result = await hey(squareProg);
  if (result instanceof Shape) {
    t.equal(result.name, "square");
    t.deepEqual(result.props, {
      size: 3,
      color: "green",
    });
  } else t.fail();
  t.end();
});

test("Square as value", async (t) => {
  const result = await hey("square");
  t.equal(typeof result, "function");
  t.equal(String(result), "(size color) -> square(size color)");
  t.end();
});

const funProg = `
fun(size) square(size green)
`;

test("User function", async (t) => {
  const fun = await hey(funProg);
  if (typeof fun == "function") {
    const result = await fun(["fake context"], 3);
    t.equal(result.name, "square");
    t.deepEqual(result.props, {
      size: 3,
      color: "green",
    });
    t.equal(fun.toString(), "(size) -> square(size green)");
  } else t.fail();
  t.end();
});

const literalProg = `
12
`;

test("Literal", async (t) => {
  const result = await hey(literalProg);
  if (typeof result == "number") {
    t.equal(result, 12);
  } else t.fail();
  t.end();
});

const defTestProg = `
def a
  def b fun(sz) square(sz blue)
  b
a(1)
`;

test("Define", async (t) => {
  const result = await hey(defTestProg);
  if (result instanceof Shape) {
    t.equal(result.name, "square");
    t.deepEqual(result.props, {
      size: 1,
      color: "blue",
    });
  } else t.fail();
  t.end();
});

test("Error", async (t) => {
  t.plan(3);
  await hey("def Az 40\n\nsquare(1 black Az)").catch((e: HeyError) =>
    t.ok(isError("expected 2 argument(s), got 3", 3, 1)(e))
  );
  await hey("square(\n1\ntransparent\n)").catch((e: HeyError) =>
    t.ok(isError("expected identifier, got transparent", 3, 1)(e))
  );
  await hey("def a fun(sz) range(sz 10 2) a(hey)").catch((e: HeyError) =>
    t.ok(isError("expected identifier, got hey", 1, 32)(e))
  );
  t.end();
});

const concatTestProg = `
c(1 c(2 3) 4)
`;

test("Concat", async (t) => {
  const result = await hey(concatTestProg);
  t.deepEqual(result, [1, 2, 3, 4]);
  t.end();
});

const repeatTestProg = `
r(c(r(blue 1) r(red 2)) 5)
`;

test("Repeat", async (t) => {
  const result = await hey(repeatTestProg);
  t.deepEqual(result, ["blue", "red", "red", "blue", "red"]);
  t.end();
});

const repeatZeroTimesTestProg = `
r(4 0)
`;

test("Repeat zero times", async (t) => {
  const result = await hey(repeatZeroTimesTestProg);
  t.deepEqual(result, []);
  t.end();
});

const elemTestProg = `
def a c("a" 2 3)
a(1)
`;

test("Elem", async (t) => {
  const result = await hey(elemTestProg);
  t.equal(result, "a");
  t.end();
});

const elemDefaultTestProg = `
def a c("b" 2 3)
a(4 "a")
`;

test("Elem Default", async (t) => {
  const result = await hey(elemDefaultTestProg);
  t.equal(result, "a");
  t.end();
});

const sequenceTestProg = `
def seq-2 fun(x y) range(y x 2)
def seq-3 fun(x y) range(y x 3)
c(seq-2 seq-3)(2)(3 3)
`;

test("Call sequence", async (t) => {
  const result = await hey(sequenceTestProg);
  t.deepEqual(result, [3, 6, 9]);
  t.end();
});

const unknownTestProg = `
def k
  def z 1
  z
z
`;

test("Unknown idetifier", async (t) => {
  t.plan(1);
  await hey(unknownTestProg).catch((e: HeyError) =>
    t.ok(isError("expected identifier, got z", 5, 1)(e))
  );
  t.end();
});

const textTestProg = `
def x "hello ""world"""
x
`;

test("Text data", async (t) => {
  const result = await hey(textTestProg);
  t.equal(result, 'hello "world"');
  t.end();
});

const notCallTestProg = `
def a 1
a(4)
`;

test("Not callable error", async (t) => {
  t.plan(1);
  await hey(notCallTestProg).catch((e: HeyError) =>
    t.ok(isError("expected function or data, got a", 3, 1)(e))
  );
  t.end();
});

const commentTestProg = `
; always return 1
def a fun(x) "pass"
; result
a("blue")
`;

test("Comments", async (t) => {
  const result = await hey(commentTestProg);
  t.equal(result, "pass");
  t.end();
});

const arityTestProg = `
def a fun(a b) b
a(2)
`;

test("Arity error", async (t) => {
  t.plan(1);
  await hey(arityTestProg).catch((e: HeyError) =>
    t.ok(isError("expected 2 argument(s), got 1", 3, 1)(e))
  );
  t.end();
});

const sliceTestProg = `
c(s(c(2 4 6) 2) s(c(1 3 5 7) 2 -2))
`;

test("Slice", async (t) => {
  const result = await hey(sliceTestProg);
  t.deepEqual(result, [4, 6, 3, 5]);
  t.end();
});

const adaTestProg = `
ada-lovelace(13)
`;

test("Ada", async (t) => {
  const result = await hey(adaTestProg);
  t.deepEqual(result, [
    "1/6",
    "0",
    "-1/30",
    "0",
    "1/42",
    "0",
    "-1/30",
    "0",
    "5/66",
    "0",
    "-691/2730",
    "0",
    "7/6",
  ]);
  t.end();
});

const funToFunTestProg = `
def name 1
def first-name 2
def person fun(name first-name)
  def data c(name first-name)
  fun(prop) data(prop)

def john person("Doe" "John")
def anna person("Doe" "Anna")
def doe c(john anna)
c(doe(1)(first-name) doe(2)(first-name) doe(2)(name))
`;

test("Function that returns a function", async (t) => {
  const result = await hey(funToFunTestProg);
  t.deepEqual(result, ["John", "Anna", "Doe"]);
  t.end();
});

const alreadyDefTestProg = `
def ab 3
def ab fun() 5
ab
`;

test("Already defined error", async (t) => {
  t.plan(1);
  await hey(alreadyDefTestProg).catch((e: HeyError) =>
    t.ok(isError("expected new identifier, got ab", 3, 5)(e))
  );
  t.end();
});

const redefGlobalTestProg = `
def a 1
def b
  def a 4
  c(a 2)
b(a)
`;

test("Can redefine global", async (t) => {
  const result = await hey(redefGlobalTestProg);
  t.equal(result, 4);
  t.end();
});

const dataLengthProgTest = `
l(c(1 2 3))
`;

test("Data length", async (t) => {
  const result = await hey(dataLengthProgTest);
  t.equal(result, 3);
  t.end();
});

const infiniteLoopTestProg = `
r(1 2000000000)
`;

test("Break", async (t) => {
  t.plan(1);
  const result = hey(infiniteLoopTestProg);
  await new Promise<void>((r) => setTimeout(() => r(), 500));
  cancel();
  await result.catch((e) =>
    t.ok(isError("expected continuation, got interruption", 2, 1)(e))
  );
  t.end();
});
