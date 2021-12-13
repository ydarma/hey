/* eslint-disable @typescript-eslint/no-unused-vars */
import ohm from "ohm-js";
import { matchError } from "./error";
import { HeyActions, IContext } from "./actions";

function getActions(impl: HeyActions): ohm.ActionDict<unknown> {
  const squareFun = sys("square", ["size", "color"]);
  const rangeFun = sys("range", ["start", "end", "step"]);
  const adaLovelaceFun = sys("adaLovelace", ["n"]);
  const concatFun = sys("concat", ["values"]);
  const repeatFun = sys("repeat", ["data", "count"]);
  const sliceFun = sys("slice", ["data", "start", "end"]);

  type ActionParams<T extends keyof HeyActions> = Parameters<HeyActions[T]>;
  type ActionResult<T extends keyof HeyActions> = ReturnType<HeyActions[T]>;
  type Action<T extends keyof HeyActions> = (
    ...args: ActionParams<T>
  ) => ActionResult<T>;

  function sys<T extends keyof HeyActions>(
    name: T,
    params: string[]
  ): Action<T> {
    const fun = impl.funct(new Context(), params, (ctx: IContext) => {
      const f = impl[name] as Action<T>;
      const args = [
        ctx,
        ...params.map((a) => impl.value(ctx, a)),
      ] as ActionParams<T>;
      return f(...args);
    });
    fun.toString = () =>
      `(${params.join(" ")}) -> ${name}(${params.join(" ")})`;
    return fun;
  }

  function f<T extends { toString: () => string }>(
    fun: T,
    toString: () => string
  ): T {
    fun.toString = toString;
    return fun;
  }

  return {
    Prog: (defs, result) =>
      impl.prog(new Context(...defs.children, result), {}, () => {
        defs.children.forEach((c) => c.eval());
        return result.eval();
      }),

    Def: (def, id, colon, body) =>
      impl.def(new Context(id, body), id.eval(), body.eval()),

    Val: (v) => impl.value(new Context(v), v.eval()),

    Known: (id) => impl.known(new Context(id), id.eval()),

    Result: (call, lpar, params, rpar) =>
      params.children.reduce(
        (seq, args) =>
          impl.result(
            new Context(call, ...params.children),
            seq,
            ...args.children.map((p) => p.eval())
          ),
        call.eval()
      ),

    Range: (call): typeof impl.range =>
      f(
        (ctx, start, end, step, ...o) => rangeFun(ctx, start, end, step, ...o),
        rangeFun.toString
      ),

    AdaLovelace: (call): typeof impl.adaLovelace =>
      f(
        (ctx, n, ...o) => adaLovelaceFun(ctx, n, ...o),
        adaLovelaceFun.toString
      ),

    Square: (call): typeof impl.square =>
      f(
        (ctx, size, color, ...o) => squareFun(ctx, size, color, ...o),
        squareFun.toString
      ),

    Concat: (call): typeof impl.concat =>
      f((ctx, ...values) => concatFun(ctx, values), concatFun.toString),

    Repeat: (call): typeof impl.repeat =>
      f(
        (ctx, data, count, ...o) => repeatFun(ctx, data, count, ...o),
        repeatFun.toString
      ),

    Slice: (call): typeof impl.slice =>
      f(
        (ctx, data, start, end, ...o) => sliceFun(ctx, data, start, end, ...o),
        sliceFun.toString
      ),

    Function: (lpar, args, rpar, arrow, body) => {
      const f = impl.funct(
        new Context(...args.children, body),
        args.children.map((p) => p.eval()),
        () => body.eval()
      );
      f.toString = () =>
        `(${args.children.map((c) => c.sourceString).join(" ")}) -> ${
          body.sourceString
        }`;
      return f;
    },

    comment: (semiColon, comment, eol) => {
      //
    },

    number: (sign, v) =>
      (sign.sourceString == "-" ? -1 : 1) * parseInt(v.sourceString),

    color: (n) => n.sourceString,

    string: (rquotes, s, lquotes) => s.sourceString,

    identifier: (id) => id.sourceString,
  };
}

type HeyEval = (source: string) => unknown;
type HeyEvalPromise = (source: string) => Promise<unknown>;

export function heyLoader(loader: () => string): HeyEval;
export function heyLoader(loader: () => Promise<string>): HeyEvalPromise;
export function heyLoader(
  loader: () => Promise<string> | string
): HeyEvalPromise | HeyEval {
  const heySource = loader();
  return typeof heySource == "string"
    ? getHey(heySource)
    : (source) =>
        heySource.then((grammar) => getHey(grammar)).then((h) => h(source));
}

function getHey(heySource: string) {
  const heyGrammar = ohm.grammar(heySource);
  const heySemantics = heyGrammar
    .createSemantics()
    .addOperation<unknown>("eval", getActions(new HeyActions()));
  return (source: string) => {
    const match = heyGrammar.match(source);
    if (match.failed()) {
      throw matchError(source, match);
    }
    return heySemantics(match).eval();
  };
}

class Context implements IContext {
  private source: string;
  private pos: number[];
  constructor(...nodes: ohm.Node[]) {
    this.source = nodes[0]?.source.sourceString;
    this.pos = nodes.map((n) => n.source.startIdx);
  }
  get(idx: number): [string, number] {
    return [this.source, this.pos[idx]];
  }
}
