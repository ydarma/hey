import test from "tape";
import { HeyActions, IContext } from "./actions";
import { Shape } from "./shape";
import { Env } from "./env";
import { HeyError } from "./error";

const actions = new HeyActions();
const env = Reflect.get(actions, "env") as Env;

class TestContext implements IContext {
  constructor(
    private readonly source: string = "",
    private readonly pos: number[] = []
  ) {}
  get(index: number): [string, number] {
    return [this.source, this.pos[index]];
  }
}

test("Program execution", (t) => {
  const result = actions.prog(new TestContext(), [{ z: 1 }], () =>
    env.get("z")
  );
  t.equal(result, 1);
  t.notok(env.has("z"));
  t.end();
});

test("Definition", (t) => {
  actions.def(new TestContext(), "y", "val");
  t.equal(env.get("y"), "val");
  t.end();
});

test("Range", (t) => {
  const result = actions.range(new TestContext(), 5, 1, 2);
  t.deepEqual(result, [1, 3, 5, 7, 9]);
  t.end();
});

test("Range error", (t) => {
  t.throws(
    () => actions.range(new TestContext(), "e", 10, 2),
    (e: HeyError) => /number/.test(e.message)
  );
  t.end();
});

test("Square", (t) => {
  const result = actions.square(new TestContext(), 1, "blue");
  t.deepEqual(result, new Shape("square", { size: 1, color: "blue" }));
  t.end();
});

test("Square error", (t) => {
  t.throws(
    () => actions.square(new TestContext(), 1, "transparent"),
    (e: HeyError) => /color/.test(e.message)
  );
  t.end();
});

test("Repeat array", (t) => {
  const result = actions.repeat(new TestContext(), [1, "blue"], 3);
  t.deepEqual(result, [1, "blue", 1]);
  t.end();
});

test("Repeat single value", (t) => {
  const result = actions.repeat(new TestContext(), 1, 3);
  t.deepEqual(result, [1, 1, 1]);
  t.end();
});

test("Function", (t) => {
  const result = actions.funct(new TestContext(), ["a"], () => env.get("a"));
  t.equal(result(new TestContext(), 1), 1);
  t.end();
});

test("Call", (t) => {
  const fun = actions.funct(new TestContext(), ["a"], () => env.get("a"));
  const result = actions.result(new TestContext(), fun, 1);
  t.equal(result, 1);
  t.notok(env.has("a"));
  t.end();
});

test("Value from identifier", (t) => {
  env.push({ k: 3 });
  const result = actions.known(new TestContext(), "k");
  t.equal(result, 3);
  env.pop();
  t.end();
});

test("Known error", (t) => {
  t.throws(
    () => actions.known(new TestContext(), "k"),
    (e: HeyError) => /identifier/.test(e.message)
  );
  t.end();
});

test("Not callable error", (t) => {
  actions.def(new TestContext(), "a", 1);
  t.throws(
    () => actions.result(new TestContext(), "a", "a"),
    (e: HeyError) => /function or data/.test(e.message)
  );
  t.end();
});

test("Arity error", (t) => {
  const fun = actions.funct(new TestContext(), ["a"], () => env.get("a"));
  t.throws(
    () => actions.result(new TestContext(), fun),
    (e: HeyError) => /argument/.test(e.message)
  );
  t.end();
});

test("Slice", (t) => {
  const slice1 = actions.slice(new TestContext(), [1, 3, 5, 7], 2);
  t.deepEqual(slice1, [3, 5, 7]);
  const slice2 = actions.slice(new TestContext(), [1, 3, 5, 7], 2, 3);
  t.deepEqual(slice2, [3, 5]);
  const slice3 = actions.slice(new TestContext(), [1, 3, 5, 7], 2, -2);
  t.deepEqual(slice3, [3, 5]);
  const slice4 = actions.slice(new TestContext(), [1, 3, 5, 7], -3, -2);
  t.deepEqual(slice4, [3, 5]);
  t.end();
});

test("Slice error", (t) => {
  t.throws(
    () => actions.slice(new TestContext(), "unknown", 1),
    (e: HeyError) => /data/.test(e.message)
  );
  t.end();
});

test("Bernouilli", (t) => {
  const result = actions.adaLovelace(new TestContext(), 7);
  t.deepEqual(result, ["1/6", "0", "-1/30", "0", "1/42", "0", "-1/30"]);
  t.end();
});
