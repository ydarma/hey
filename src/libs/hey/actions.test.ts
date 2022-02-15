import test from "tape";
import { HeyActions, IContext } from "./actions";
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

test("Program execution", async (t) => {
  const result = await actions.prog(new TestContext(), [{ z: 1 }], async () =>
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

test("Range", async (t) => {
  const result = await actions.range(new TestContext(), 5, 1, 2);
  t.deepEqual(result, [1, 3, 5, 7, 9]);
  t.end();
});

test("Range error", async (t) => {
  t.plan(1);
  await actions
    .range(new TestContext(), "e", 10, 2)
    .catch((e: HeyError) => t.ok(/number/.test(e.message)));
  t.end();
});

test("Square", (t) => {
  const result = actions.square(new TestContext(), 1, "blue");
  t.deepLooseEqual(result, {
    name: "square",
    rotation: 0,
    size: 1,
    color: "blue",
  });
  t.end();
});

test("Merge", (t) => {
  const sq1 = actions.square(new TestContext(), 58, "red");
  const sq2 = actions.square(new TestContext(), 40, "green", 45);
  const result = actions.assemble(new TestContext(), sq1, sq2);
  t.equal(result.name, "composite");
  t.equal(Reflect.get(result, "shape1").name, "square");
  t.equal(Reflect.get(result, "shape1").size, 58);
  t.equal(Reflect.get(result, "shape2").name, "square");
  t.equal(Reflect.get(result, "shape2").rotation, 45);
  t.end();
});

test("Square error", (t) => {
  t.throws(
    () => actions.square(new TestContext(), 1, "transparent"),
    (e: HeyError) => /color/.test(e.message)
  );
  t.end();
});

test("Repeat array", async (t) => {
  const result = await actions.repeat(new TestContext(), [1, "blue"], 3);
  t.deepEqual(result, [1, "blue", 1]);
  t.end();
});

test("Repeat single value", async (t) => {
  const result = await actions.repeat(new TestContext(), 1, 3);
  t.deepEqual(result, [1, 1, 1]);
  t.end();
});

test("Function", async (t) => {
  const result = await actions.funct(new TestContext(), ["a"], async () =>
    env.get("a")
  );
  t.equal(await result(new TestContext(), 1), 1);
  t.end();
});

test("Call", async (t) => {
  const fun = await actions.funct(new TestContext(), ["a"], async () =>
    env.get("a")
  );
  const result = await actions.result(new TestContext(), fun, 1);
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

test("Not callable error", async (t) => {
  t.plan(1);
  actions.def(new TestContext(), "a", 1);
  await actions
    .result(new TestContext(), "a", "a")
    .catch((e: HeyError) => t.ok(/function or data/.test(e.message)));
  t.end();
});

test("Arity error", async (t) => {
  t.plan(1);
  const fun = await actions.funct(new TestContext(), ["a"], async () =>
    env.get("a")
  );
  await actions
    .result(new TestContext(), fun)
    .catch((e: HeyError) => t.ok(/argument/.test(e.message)));
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

test("Vector", (t) => {
  const vector = actions.vector(new TestContext(), 3, 4);
  t.equal(vector.x, 3);
  t.equal(vector.y, 4);
  t.end();
});

test("Bernouilli", async (t) => {
  const result = await actions.adaLovelace(new TestContext(), 7);
  t.deepEqual(result, ["1/6", "0", "-1/30", "0", "1/42", "0", "-1/30"]);
  t.end();
});

test("Parallelogram", (t) => {
  const parallelogram = actions.parall(
    new TestContext(),
    50,
    30,
    -20,
    "grey",
    30
  );
  t.deepLooseEqual(parallelogram, {
    name: "parallelogram",
    base: 50,
    height: 30,
    offset: -20,
    color: "grey",
    rotation: 30,
  });
  t.end();
});
