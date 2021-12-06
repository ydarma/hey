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

    Square: (call, lpar, size, color, rpar) =>
      square(size.eval(), color.eval()),

    Fun: (args, colon, body) => fun(args.eval(), body),

    argList: (lpar, args, rpar) =>
      args.asIteration().children.map((c: { eval: () => unknown }) => c.eval()),

    number: (value) => parseInt(value.sourceString, 10),

    color: (name) => name.sourceString,

    identifier: (id) => id.sourceString,
  });

type H<T extends unknown[]> = {
  [k in keyof T]: string | T[k];
};

class Env {
  private static stack: { [id: string]: unknown }[] = [{}];

  private pick() {
    return Env.stack[Env.stack.length - 1];
  }

  get<T>(id: string | T): T;
  get<T extends unknown[]>(...ids: H<T>): T;
  get<T extends unknown[]>(...ids: H<T>): T {
    if (ids.length == 1) {
      const id = ids[0];
      return (
        typeof id == "string" && id in this.pick() ? this.pick()[id] : id
      ) as T;
    }
    return ids.map((id) => this.get(id)) as T;
  }

  push(local: { [id: string]: unknown }) {
    Env.stack.push({ ...this.pick(), ...local });
  }

  pop() {
    Env.stack.pop();
  }
}

function range(
  start: string | number,
  end: string | number,
  step: string | number,
  env = new Env()
) {
  [start, end, step] = env.get(start, end, step);
  const result = [];
  for (let i = start; i < end; i += step) result.push(i);
  return result;
}

function square(size: string | number, color: string, env = new Env()) {
  [size, color] = env.get(size, color);
  return new Shape("square", { size, color });
}

function fun(args: string[], body: ohm.Node, env = new Env()) {
  return (...value: unknown[]) => {
    const local = args.reduce((e, a, i) => ({ ...e, [a]: value[i] }), {});
    env.push(local);
    return body.eval();
  };
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
