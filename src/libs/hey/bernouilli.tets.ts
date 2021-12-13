import test from "tape";
import { b, comb } from "./bernouilli";

test("combination", (t) => {
  t.equal(comb(1, 4).valueOf(), 4);
  t.equal(comb(2, 4).valueOf(), 6);
  t.equal(comb(3, 4).valueOf(), 4);
  t.equal(comb(4, 4).valueOf(), 1);
  t.equal(comb(1, 5).valueOf(), 5);
  t.equal(comb(2, 5).valueOf(), 10);
  t.equal(comb(3, 5).valueOf(), 10);
  t.equal(comb(4, 5).valueOf(), 5);
  t.equal(comb(5, 5).valueOf(), 1);
  t.end();
});

test("bernouilli numbers", (t) => {
  t.deepEqual(b(12), [-691, 2730]);
  t.end();
});
