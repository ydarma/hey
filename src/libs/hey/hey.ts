/* eslint-disable @typescript-eslint/no-unused-vars */
import ohm from "ohm-js";
import { matchError } from "./error";
import { HeyActions, IContext } from "./actions";

function getActions(impl: HeyActions): ohm.ActionDict<Promise<unknown>> {
  const squareFun = sys("square", ["size", "color"]);
  const rangeFun = sys("range", ["start", "end", "step"]);
  const adaLovelaceFun = sys("adaLovelace", ["n"]);
  const concatFun = sys("concat", ["values"]);
  const repeatFun = sys("repeat", ["data", "count"]);
  const sliceFun = sys("slice", ["data", "start", "end"]);
  const lengthFun = sys("length", ["data"]);

  type ExecActions = Omit<HeyActions, "cancel">;
  type ActionParams<T extends keyof ExecActions> = Parameters<ExecActions[T]>;
  type ActionResult<T extends keyof ExecActions> = Promise<
    ReturnType<ExecActions[T]>
  >;
  type Action<T extends keyof ExecActions> = (
    ...args: ActionParams<T>
  ) => ActionResult<T>;

  function sys<T extends keyof ExecActions>(
    name: T,
    params: string[]
  ): Action<T> {
    const fun = impl.funct(new Context(), params, async (ctx: IContext) => {
      const f = impl[name] as Action<T>;
      const args = [
        ctx,
        ...params.map((a) => impl.known(ctx, a)),
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
    Prog: (defs, result) => {
      return impl.prog(
        new Context(...defs.children, result),
        [{}],
        async () => {
          for (const c of defs.children) await c.eval();
          return await result.eval();
        }
      );
    },

    Def: async (def, id, colon, body) =>
      impl.def(new Context(id, body), await id.eval(), await body.eval()),

    Val: async (v) => await v.eval(),

    Known: async (id) => impl.known(new Context(id), await id.eval()),

    Result: async (call, lpar, params, rpar) =>
      await params.children.reduce(async (seq, args) => {
        const argValues = [];
        for (const c of args.children) argValues.push(await c.eval());
        return await impl.result(
          new Context(call, ...params.children),
          seq,
          ...argValues
        );
      }, await call.eval()),

    Range: async (call): Promise<Action<"range">> =>
      await f(
        (ctx, count, start, step, ...o) =>
          rangeFun(ctx, count, start, step, ...o),
        rangeFun.toString
      ),

    AdaLovelace: async (call): Promise<Action<"adaLovelace">> =>
      await f(
        (ctx, n, ...o) => adaLovelaceFun(ctx, n, ...o),
        adaLovelaceFun.toString
      ),

    Square: async (call): Promise<Action<"square">> =>
      await f(
        (ctx, size, color, ...o) => squareFun(ctx, size, color, ...o),
        squareFun.toString
      ),

    Concat: async (call): Promise<Action<"concat">> =>
      await f((ctx, ...values) => concatFun(ctx, values), concatFun.toString),

    Repeat: async (call): Promise<Action<"repeat">> =>
      await f(
        (ctx, data, count, ...o) => repeatFun(ctx, data, count, ...o),
        repeatFun.toString
      ),

    Slice: async (call): Promise<Action<"slice">> =>
      await f(
        (ctx, data, start, end, ...o) => sliceFun(ctx, data, start, end, ...o),
        sliceFun.toString
      ),

    Length: async (call): Promise<Action<"length">> =>
      await f(
        (ctx, data, ...o) => lengthFun(ctx, data, ...o),
        lengthFun.toString
      ),

    Function: async (fun, lpar, args, rpar, arrow, body, dot) => {
      const argValues = [];
      for (const c of args.children) argValues.push(await c.eval());
      const f = impl.funct(
        new Context(...args.children, body),
        argValues,
        async () => await body.eval()
      );
      f.toString = () =>
        `(${args.children.map((c) => c.sourceString).join(" ")}) -> ${
          body.sourceString
        }`;
      return await f;
    },

    comment: async (semiColon, comment, eol) => {
      //
    },

    number: async (sign, v) =>
      (sign.sourceString == "-" ? -1 : 1) * parseInt(v.sourceString),

    color: async (n) => n.sourceString,

    string: async (rquotes, s, lquotes) => s.sourceString.replace(/""/g, '"'),

    identifier: async (id) => id.sourceString,
    builtin: async (id) => id.sourceString,
  };
}

type HeyEvalPromise = (source: string) => Promise<unknown>;
type HeyCancelation = () => void;

export function heyLoader(loader: () => Promise<string> | string): {
  hey: HeyEvalPromise;
  cancel: HeyCancelation;
} {
  const actions = new HeyActions();
  const cancel = () => actions.cancel();
  const heySource = loader();
  return typeof heySource == "string"
    ? { hey: getHey(heySource, actions), cancel }
    : {
        hey: (source) =>
          heySource
            .then((grammar) => getHey(grammar, actions))
            .then((h) => h(source)),
        cancel,
      };
}

function getHey(heySource: string, actions: HeyActions) {
  const heyGrammar = ohm.grammar(heySource);
  const heySemantics = heyGrammar
    .createSemantics()
    .addOperation<Promise<unknown>>("eval", getActions(actions));
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
