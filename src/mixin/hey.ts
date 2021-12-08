/* eslint-disable @typescript-eslint/no-unused-vars */
import ohm from "ohm-js";
import fs from "fs";
import path from "path";
import { numberError, colorError, identifierError, matchError } from "./error";

const heyFile = path.join(__dirname, "/hey.ohm");
const heyText = fs.readFileSync(heyFile).toString();
const heyGrammar = ohm.grammar(heyText);

export class Shape {
  constructor(
    public name: string,
    public props: Record<string, number | string>
  ) {}
}

class Env {
  private stack: Record<string, unknown>[] = [{}];

  pick() {
    return this.stack[this.stack.length - 1];
  }

  has<T>(id: V<T>): boolean {
    return typeof id == "string" && id in this.pick();
  }

  get<T>(id: V<T>): T {
    return (
      typeof id == "string" && id in this.pick() ? this.pick()[id] : id
    ) as T;
  }

  push(local: { [id: string]: unknown }) {
    this.stack.push({ ...this.pick(), ...local });
  }

  pop() {
    this.stack.pop();
  }
}

class HeyActions {
  private readonly env = new Env();

  prog(local: Record<string, unknown>, body: () => unknown) {
    this.env.push(local);
    const result = body();
    this.env.pop();
    return result;
  }

  def(id: string, body: unknown) {
    this.env.pick()[id] = body;
  }

  range(ctx: Context, start: V<number>, end: V<number>, step: V<number>) {
    if (!isNumber(start)) throw numberError(...ctx.get(0), start);
    if (!isNumber(end)) throw numberError(...ctx.get(1), end);
    if (!isNumber(step)) throw numberError(...ctx.get(2), step);
    const result = [];
    for (let i = start; i < end; i += step) result.push(i);
    return result;
  }

  square(ctx: Context, size: V<number>, color: V<string>) {
    if (!isNumber(size)) throw numberError(...ctx.get(0), size);
    if (!isColor(color)) throw colorError(...ctx.get(1), color);
    return new Shape("square", { size, color });
  }

  concat(ctx: Context, ...values: unknown[]) {
    return values.reduce<unknown[]>(
      (result, v) => [...result, ...(Array.isArray(v) ? v : [v])],
      []
    );
  }

  repeat(ctx: Context, count: number, ...values: unknown[]) {
    const result = new Array(count);
    for (let i = 0; i < count; i++) result[i] = values[i % values.length];
    return result;
  }

  fun(args: string[], body: () => unknown) {
    return (...value: unknown[]) => {
      const local = args.reduce((e, a, i) => ({ ...e, [a]: value[i] }), {});
      const result = this.prog(local, body);
      return result;
    };
  }

  call(id: string, values: unknown[]) {
    const callable = this.env.get<(...a: unknown[]) => unknown | unknown[]>(id);
    return this.callSeq(callable, values);
  }

  callSeq(
    callable: (...a: unknown[]) => unknown | unknown[],
    values: unknown[]
  ) {
    return Array.isArray(callable)
      ? callable[(values[0] as number) - 1]
      : callable(...values);
  }

  value(ctx: Context, v: unknown) {
    return this.env.get(v);
  }

  known(ctx: Context, v: unknown) {
    if (this.env.has(v)) return this.env.get(v);
    throw identifierError(...ctx.get(0), String(v));
  }
}

function isColor(color: V<string>): color is string {
  return (heyGrammar.rules.color.body as ohm.Alt).terms.some(
    (t) => t.obj == color
  );
}

function isNumber(num: V<number>): num is number {
  return typeof num == "number";
}

function getActions(impl: HeyActions): ohm.ActionDict<unknown> {
  return {
    Prog: (defs, result) =>
      impl.prog({}, () => {
        defs.children.forEach((c) => c.eval());
        return result.eval();
      }),

    Def: (def, id, colon, body) => impl.def(id.eval(), body.eval()),

    Val: (v) => impl.value(new Context(v), v.eval()),
    V: (v) => impl.value(new Context(v), v.eval()),

    Known: (id) => impl.known(new Context(id), id.eval()),

    Call: (id, lpar, params, rpar) =>
      impl.call(
        id.eval(),
        params.children.map((p) => p.eval())
      ),

    CallSeq: (call, lpar, params, rpar) =>
      params.children.reduce(
        (seq, args) =>
          impl.callSeq(
            seq,
            args.children.map((p) => p.eval())
          ),
        call.eval()
      ),

    Range: (call, lpar, start, end, step, rpar) =>
      impl.range(
        new Context(start, end, step),
        start.eval(),
        end.eval(),
        step.eval()
      ),

    Square: (call, lpar, size, color, rpar) =>
      impl.square(new Context(size, color), size.eval(), color.eval()),

    Concat: (call, lpar, values, rpar) =>
      impl.concat(
        new Context(...values.children),
        ...values.children.map((p) => p.eval())
      ),

    Repeat: (call, lpar, count, values, rpar) =>
      impl.repeat(
        new Context(count, ...values.children),
        count.eval(),
        ...values.children.map((p) => p.eval())
      ),

    Fun: (lpar, args, rpar, arrow, body) =>
      impl.fun(
        args.children.map((p) => p.eval()),
        () => body.eval()
      ),

    number: (v) => parseInt(v.sourceString),

    color: (name) => name.sourceString,

    identifier: (lh, id) => id.sourceString,
  };
}

const heySemantics = heyGrammar
  .createSemantics()
  .addOperation<unknown>("eval", getActions(new HeyActions()));

export function hey(source: string): unknown {
  const match = heyGrammar.match(source);
  if (match.failed()) {
    throw matchError(source, match);
  }
  return heySemantics(match).eval();
}

type V<T> = string | T;
type H<T extends unknown[]> = {
  [k in keyof T]: V<T[k]>;
};

class Context {
  private source: string;
  private pos: number[];
  constructor(...nodes: ohm.Node[]) {
    this.source = nodes[0].source.sourceString;
    this.pos = nodes.map((n) => n.source.startIdx);
  }
  get(idx: number): [string, number] {
    return [this.source, this.pos[idx]];
  }
}
