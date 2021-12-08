/* eslint-disable @typescript-eslint/no-unused-vars */
import ohm from "ohm-js";
import fs from "fs";
import path from "path";

declare module "ohm-js" {
  interface PosInfo {
    memo: Record<string, unknown>;
  }
  interface MatchResult {
    getRightmostFailurePosition(): number;
    matcher: Matcher;
  }
  interface Matcher {
    memoTable: PosInfo[];
  }
  interface Alt {
    terms: { obj: unknown }[];
  }
  interface Interval {
    sourceString: string;
  }
}

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
    if (!isNumber(start)) throw numberError(start, ...ctx.get(0));
    if (!isNumber(end)) throw numberError(end, ...ctx.get(1));
    if (!isNumber(step)) throw numberError(step, ...ctx.get(2));
    const result = [];
    for (let i = start; i < end; i += step) result.push(i);
    return result;
  }

  square(ctx: Context, size: V<number>, color: V<string>) {
    if (!isNumber(size)) throw numberError(size, ...ctx.get(0));
    if (!isColor(color)) throw colorError(color, ...ctx.get(1));
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
    throw identifierError(String(v), ...ctx.get(0));
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
    throw matchError(match, source);
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

type Error = {
  line: number;
  col: number;
  message: string;
};

function error(
  { rule, val, pos }: { rule: string; val?: unknown; pos: number },
  source: string
): Error {
  const { line, col, value } = getLineCol(pos);
  return {
    line: line,
    col: col,
    message: `expected ${rule}, got ${val ?? value}`,
  };

  function getLineCol(pos: number) {
    const sofar = source.substring(0, pos + 1);
    const lines = sofar.split(/\r\n|\r|\n/g);
    const line = lines.length;
    const col = lines[lines.length - 1].length;
    const value = sofar.slice(-1);
    return { line, col, value };
  }
}

function colorError(val: string, source: string, pos: number) {
  return error(
    {
      rule: "V<color>",
      val,
      pos,
    },
    source
  );
}

function numberError(val: string, source: string, pos: number) {
  return error(
    {
      rule: "V<number>",
      val,
      pos,
    },
    source
  );
}

function identifierError(val: string, source: string, pos: number) {
  return error(
    {
      rule: "identifier",
      val,
      pos,
    },
    source
  );
}

function matchError(match: ohm.MatchResult, source: string) {
  const pos = match.getRightmostFailurePosition();
  const infos = Object.keys(match.matcher.memoTable[pos].memo);
  const rule = infos[infos.length - 1];
  return error(
    {
      rule,
      pos,
    },
    source
  );
}
