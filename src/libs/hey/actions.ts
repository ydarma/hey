import { b } from "./bernouilli";
import { Env, V } from "./env";
import {
  numberError,
  colorError,
  identifierError,
  callError,
  arityError,
  dataError,
} from "./error";
import { Shape } from "./shape";

export interface IContext {
  get(index: number): [string, number];
}

export class HeyActions {
  private readonly env = new Env();

  prog<T>(
    ctx: IContext,
    local: Record<string, unknown>,
    body: (ctx: IContext) => T
  ): T {
    this.env.push(local);
    const result = body(ctx);
    this.env.pop();
    return result;
  }

  def(ctx: IContext, id: string, body: unknown): void {
    this.env.pick()[id] = body;
  }

  range(
    ctx: IContext,
    start: V<number>,
    end: V<number>,
    step?: V<number>
  ): number[] {
    if (!isNumber(start)) throw numberError(...ctx.get(0), start);
    if (!isNumber(end)) throw numberError(...ctx.get(1), end);
    if (typeof step != "undefined" && !isNumber(step))
      throw numberError(...ctx.get(2), step);
    const result = [];
    for (let i = start; i <= end; i += step ?? 1) result.push(i);
    return result;
  }

  adaLovelace(ctx: IContext, n: V<number>): string[] {
    if (!isNumber(n)) throw numberError(...ctx.get(0), n);
    const result = [];
    for (let i = 1; i <= n; i++) {
      const nb = b(i + 1);
      result.push(nb[0] == 0 ? "0" : `${nb[0]}/${nb[1]}`);
    }
    return result;
  }

  square(ctx: IContext, size: V<number>, color: V<string>): Shape {
    if (!isNumber(size)) throw numberError(...ctx.get(0), size);
    if (!isColor(color)) throw colorError(...ctx.get(1), color);
    return new Shape("square", { size, color });
  }

  concat(ctx: IContext, values: unknown[]): unknown[] {
    return values.reduce<unknown[]>(
      (result, v) => [...result, ...(Array.isArray(v) ? v : [v])],
      []
    );
  }

  repeat(ctx: IContext, data: unknown, count: number): unknown[] {
    if (!isNumber(count)) throw numberError(...ctx.get(1), count);
    const arr = Array.isArray(data) ? data : [data];
    const result = new Array(count);
    for (let i = 0; i < count; i++) result[i] = arr[i % arr.length];
    return result;
  }

  slice(
    ctx: IContext,
    data: V<unknown[]>,
    start: V<number>,
    end?: V<number>
  ): unknown[] {
    if (!isData(data)) throw dataError(...ctx.get(0), data);
    if (!isNumber(start)) throw numberError(...ctx.get(1), start);
    if (end != undefined && !isNumber(end))
      throw numberError(...ctx.get(2), end);
    return data.slice(start - 1, end && end < 0 ? end + 1 : end);
  }

  funct<T>(
    ctx: IContext,
    args: string[],
    body: (ctx: IContext) => T
  ): (ctx: IContext, ...values: unknown[]) => T {
    return (ctx: IContext, ...values: unknown[]) => {
      if (values.length != args.length)
        throw arityError(...ctx.get(0), values.length, args.length);
      const local = args.reduce((e, a, i) => ({ ...e, [a]: values[i] }), {});
      return this.prog(ctx, local, body);
    };
  }

  result(
    ctx: IContext,
    callable: V<(ctx: IContext, ...a: unknown[]) => unknown | unknown[]>,
    ...values: unknown[]
  ): unknown {
    if (isData(callable)) return callable[(values[0] as number) - 1];
    if (isFunction(callable)) return callable(ctx, ...values);
    throw callError(...ctx.get(0));
  }

  value<T>(ctx: IContext, v: V<T>): T {
    return this.env.get(v);
  }

  known(ctx: IContext, v: unknown): unknown {
    if (this.env.has(v)) return this.value(ctx, v);
    throw identifierError(...ctx.get(0), String(v));
  }

  unknown(ctx: IContext, v: unknown): unknown {
    if (!this.env.has(v)) return v;
    throw identifierError(...ctx.get(0), String(v));
  }
}

function isColor(color: V<string>): color is string {
  return [
    "green",
    "blue",
    "yellow",
    "red",
    "purple",
    "grey",
    "black",
    "white",
    "orange",
  ].includes(color);
}

function isNumber(num: V<number>): num is number {
  return typeof num == "number";
}

function isFunction(
  callable: unknown
): callable is (...a: unknown[]) => unknown {
  return typeof callable == "function";
}

function isData(callable: unknown): callable is unknown[] {
  return Array.isArray(callable);
}
