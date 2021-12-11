import test from "tape";
import {
  arityError,
  callError,
  colorError,
  dataError,
  identifierError,
  numberError,
} from "./error";

test("Number error", (t) => {
  t.deepEqual(numberError("\nnumber: e", 9, "e"), {
    line: 2,
    col: 9,
    message: "expected number, got e",
  });
  t.end();
});

test("Color error", (t) => {
  t.deepEqual(colorError("\ncolor: transparent", 8, "transparent"), {
    line: 2,
    col: 8,
    message: "expected color, got transparent",
  });
  t.end();
});

test("Identifier error", (t) => {
  t.deepEqual(identifierError("\nidentifier:\n$", 13, "$"), {
    line: 3,
    col: 1,
    message: "expected identifier, got $",
  });
  t.end();
});

test("Call error", (t) => {
  t.deepEqual(callError("a(1)", 1, "a"), {
    line: 1,
    col: 2,
    message: "expected function or data, got a",
  });
  t.end();
});

test("Arity error", (t) => {
  t.deepEqual(arityError("a(1 2)", 1, 2, 3), {
    line: 1,
    col: 2,
    message: "expected 3 argument(s), got 2",
  });
  t.end();
});

test("dataError", (t) => {
  t.deepEqual(dataError("s(3, 4)", 2, "3"), {
    line: 1,
    col: 3,
    message: "expected data, got 3",
  });
  t.end();
});
