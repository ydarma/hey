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
      side: 3,
      color: "green",
    });
  } else t.fail();
  t.end();
});
