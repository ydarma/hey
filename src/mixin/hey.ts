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
  private stack: { [id: string]: unknown }[] = [{}];

  pick() {
    return this.stack[this.stack.length - 1];
  }

  get<T>(id: V<T>): T;
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

class HeyActions {
  private env = new Env();

  def(id: string, body: unknown) {
    this.env.pick()[id] = body;
  }

  range(start: V<number>, end: V<number>, step: V<number>, ctx: Context) {
    if (!isNumber(start)) throw numberError(start, ...ctx.get(0));
    if (!isNumber(end)) throw numberError(end, ...ctx.get(1));
    if (!isNumber(step)) throw numberError(step, ...ctx.get(2));
    const result = [];
    for (let i = start; i < end; i += step) result.push(i);
    return result;
  }

  square(size: V<number>, color: V<string>, ctx: Context) {
    if (!isNumber(size)) throw numberError(size, ...ctx.get(0));
    if (!isColor(color)) throw colorError(color, ...ctx.get(1));
    return new Shape("square", { size, color });
  }

  fun(args: string[], body: () => unknown) {
    return (...value: unknown[]) => {
      const local = args.reduce((e, a, i) => ({ ...e, [a]: value[i] }), {});
      this.env.push(local);
      return body();
    };
  }

  call(id: string, values: unknown[]) {
    return this.env.get<(...a: unknown[]) => unknown>(id)(...values);
  }

  value(v: unknown) {
    return this.env.get(v);
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
    Prog: (defs, result) => {
      defs.children.forEach((c) => c.eval());
      return result.eval();
    },

    Def: (def, id, colon, body) => impl.def(id.eval(), body.eval()),

    Val: (v) => impl.value(v.eval()),
    V: (v) => impl.value(v.eval()),

    Call: (id, lpar, params, rpar) =>
      impl.call(
        id.eval(),
        params.children.map((p) => p.eval())
      ),

    Range: (call, lpar, start, end, step, rpar) =>
      impl.range(
        start.eval(),
        end.eval(),
        step.eval(),
        new Context(start, end, step)
      ),

    Square: (call, lpar, size, color, rpar) =>
      impl.square(size.eval(), color.eval(), new Context(size, color)),

    Fun: (args, arrow, body) => impl.fun(args.eval(), () => body.eval()),

    ArgList: (lpar, args, rpar) => args.children.map((c) => c.eval()),

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
    throw error(match, source);
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

function error(match: ohm.MatchResult, source: string): Error;
function error(
  match: { rule: string; val: unknown; pos: number },
  source: string
): Error;
function error(
  match: ohm.MatchResult | { rule: string; val: unknown; pos: number },
  source: string
): Error {
  if ("pos" in match) {
    return build(match.rule, match.pos, match.val);
  }
  const pos = match.getRightmostFailurePosition();
  const infos = Object.keys(match.matcher.memoTable[pos].memo);
  const rule = infos[infos.length - 1];
  return build(rule, pos);

  function getLineCol(pos: number) {
    const sofar = source.substring(0, pos + 1);
    const lines = sofar.split(/\r\n|\r|\n/g);
    const line = lines.length;
    const col = lines[lines.length - 1].length;
    const value = sofar.slice(-1);
    return { line, col, value };
  }

  function build(rule: string, pos: number, val?: unknown) {
    const { line, col, value } = getLineCol(pos);
    return {
      line: line,
      col: col,
      message: `expected ${rule}, got ${val ?? value}`,
    };
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
