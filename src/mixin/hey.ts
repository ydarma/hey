/* eslint-disable @typescript-eslint/no-unused-vars */
import ohm from "ohm-js";
import fs from "fs";
import path from "path";

const heyFile = path.join(__dirname, "/hey.ohm");
const heyText = fs.readFileSync(heyFile).toString();
const heyGrammar = ohm.grammar(heyText);

type K<T> = string | T;
type H<T extends unknown[]> = {
  [k in keyof T]: K<T[k]>;
};

class Env {
  private stack: { [id: string]: unknown }[] = [{}];

  private pick() {
    return this.stack[this.stack.length - 1];
  }

  get<T>(id: K<T>): T;
  get<T extends unknown[]>(...ids: H<T>): T;
  get<T extends unknown[]>(...ids: H<T>): T | T[0] {
    if (ids.length == 1) {
      const id = ids[0];
      return (
        typeof id == "string" && id in this.pick() ? this.pick()[id] : id
      ) as T[0];
    }
    return ids.map((id) => this.get(id)) as T;
  }

  push(local: { [id: string]: unknown }) {
    this.stack.push({ ...this.pick(), ...local });
  }

  pop() {
    this.stack.pop();
  }
}

export class Shape {
  constructor(
    public name: string,
    public props: Record<string, number | string>
  ) {}
}

class HeyActions {
  private env = new Env();

  range(start: number, end: number, step: number) {
    const result = [];
    for (let i = start; i < end; i += step) result.push(i);
    return result;
  }

  square(size: number, color: string) {
    return new Shape("square", { size, color });
  }

  fun(args: string[], body: () => unknown) {
    return (...value: unknown[]) => {
      const local = args.reduce((e, a, i) => ({ ...e, [a]: value[i] }), {});
      this.env.push(local);
      return body();
    };
  }

  value(v: unknown) {
    return this.env.get(v);
  }
}

function getActions(impl: HeyActions): ohm.ActionDict<unknown> {
  return {
    Range: (call, lpar, start, end, step, rpar) =>
      impl.range(start.eval(), end.eval(), step.eval()),

    Square: (call, lpar, size, color, rpar) =>
      impl.square(size.eval(), color.eval()),

    Fun: (args, colon, body) => impl.fun(args.eval(), () => body.eval()),

    value: (v) => impl.value(v.eval()),

    argList: (lpar, args, rpar) =>
      args.asIteration().children.map((c: { eval: () => unknown }) => c.eval()),

    number: (v) => parseInt(v.sourceString),

    color: (name) => name.sourceString,

    identifier: (id) => id.sourceString,
  };
}

const heySemantics = heyGrammar
  .createSemantics()
  .addOperation<unknown>("eval", getActions(new HeyActions()));

export function hey(source: string): unknown {
  const match = heyGrammar.match(source);
  return heySemantics(match).eval();
}
