import test from "tape";
import { Env } from "./env";

test("Push env", (t) => {
  const env = new Env();
  env.push({ r: 1 });
  t.ok(env.has("r"));
  t.end();
});

test("Pick env", (t) => {
  const env = new Env();
  env.push({ r: 1 });
  t.equal(env.pick().r, 1);
  t.end();
});

test("Get env", (t) => {
  const env = new Env();
  env.push({ r: 1 });
  t.equal(env.get("r"), 1);
  t.end();
});

test("Pop env", (t) => {
  const env = new Env();
  env.push({ r: 1 });
  env.push({ s: 2 });
  t.ok(env.has("r") && env.has("s"));
  env.pop();
  t.ok(env.has("r") && !env.has("s"));
  env.pop();
  t.ok(!env.has("r") && !env.has("s"));
  t.end();
});
