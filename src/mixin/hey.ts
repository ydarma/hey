/* eslint-disable @typescript-eslint/no-unused-vars */
import ohm from "ohm-js";
import fs from "fs";
import path from "path";

const heyFile = path.join(__dirname, "/hey.ohm");
const heyText = fs.readFileSync(heyFile).toString();
const heyGrammar = ohm.grammar(heyText);

type H<T extends unknown[]> = {
  [k in keyof T]: string | T[k];
};

class Env {
  private stack: { [id: string]: unknown }[] = [{}];

  private pick() {
    return this.stack[this.stack.length - 1];
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

  range(start: string | number, end: string | number, step: string | number) {
    [start, end, step] = this.env.get(start, end, step);
    const result = [];
    for (let i = start; i < end; i += step) result.push(i);
    return result;
  }

  square(size: string | number, color: string) {
    [size, color] = this.env.get(size, color);
    return new Shape("square", { size, color });
  }

  fun(args: string[], body: ohm.Node) {
    return (...value: unknown[]) => {
      const local = args.reduce((e, a, i) => ({ ...e, [a]: value[i] }), {});
      this.env.push(local);
      return body.eval();
    };
  }

  static get(): ohm.ActionDict<unknown> {
    const impl = new HeyActions();
    return {
      Range: (call, lpar, start, end, step, rpar) =>
        impl.range(start.eval(), end.eval(), step.eval()),

      Square: (call, lpar, size, color, rpar) =>
        impl.square(size.eval(), color.eval()),

      Fun: (args, colon, body) => impl.fun(args.eval(), body),

      argList: (lpar, args, rpar) =>
        args
          .asIteration()
          .children.map((c: { eval: () => unknown }) => c.eval()),

      number: (value) => parseInt(value.sourceString, 10),

      color: (name) => name.sourceString,

      identifier: (id) => id.sourceString,
    };
  }
}

const heySemantics = heyGrammar
  .createSemantics()
  .addOperation<unknown>("eval", HeyActions.get());

export function hey(source: string): unknown {
  const match = heyGrammar.match(source);
  return heySemantics(match).eval();
}
