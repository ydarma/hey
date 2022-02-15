import test from "tape";
import { vector } from "./vector";

test("Vector", (t) => {
  const v = vector(3, 4);
  t.equal(v.x, 3);
  t.equal(v.y, 4);
  t.end();
});
