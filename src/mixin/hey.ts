/* eslint-disable @typescript-eslint/no-unused-vars */
import ohm from "ohm-js";
import fs from "fs";
import path from "path";

const heyFile = path.join(__dirname, "/hey.ohm");
const heyText = fs.readFileSync(heyFile).toString();
const heyGrammar = ohm.grammar(heyText);

const heySemantics = heyGrammar
  .createSemantics()
  .addOperation<unknown>("eval", {
    Range: (call, lpar, start, end, step, rpar) =>
      range(start.eval(), end.eval(), step.eval()),

    Square: (call, lpar, side, color, rpar) =>
      square(side.eval(), color.eval()),

    number: (value) => parseInt(value.sourceString, 10),

    color: (value) => value.sourceString,
  });

function range(start: number, end: number, step: number) {
  const result = [];
  for (let i = start; i < end; i += step) result.push(i);
  return result;
}

function square(side: number, color: string) {
  return new Shape("square", { side, color });
}

export class Shape {
  constructor(
    public name: string,
    public props: Record<string, number | string>
  ) {}
}

export function hey(source: string): unknown {
  const match = heyGrammar.match(source);
  return heySemantics(match).eval();
}
