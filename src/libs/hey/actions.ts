import { Env, V } from "./env";
import {
  numberError,
  colorError,
  identifierError,
  callError,
  arityError,
  dataError,
} from "./error";

export interface IContext {
  get(index: number): [string, number];
}

export class Shape {
  constructor(
    public name: string,
    public props: Record<string, number | string>
  ) {}
}

export class HeyActions {
  private readonly env = new Env();

  prog(local: Record<string, unknown>, body: () => unknown): unknown {
    this.env.push(local);
    const result = body();
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
    step: V<number>
  ): number[] {
    if (!isNumber(start)) throw numberError(...ctx.get(0), start);
    if (!isNumber(end)) throw numberError(...ctx.get(1), end);
    if (!isNumber(step)) throw numberError(...ctx.get(2), step);
    const result = [];
    for (let i = start; i < end; i += step) result.push(i);
    return result;
  }

  square(ctx: IContext, size: V<number>, color: V<string>): Shape {
    if (!isNumber(size)) throw numberError(...ctx.get(0), size);
    if (!isColor(color)) throw colorError(...ctx.get(1), color);
    return new Shape("square", { size, color });
  }

  concat(ctx: IContext, ...values: unknown[]): unknown[] {
    return values.reduce<unknown[]>(
      (result, v) => [...result, ...(Array.isArray(v) ? v : [v])],
      []
    );
  }

  repeat(ctx: IContext, count: number, values: unknown): unknown[] {
    const arr = Array.isArray(values) ? values : [values];
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

  funct(
    ctx: IContext,
    args: string[],
    body: () => unknown
  ): (ctx: IContext, ...values: unknown[]) => unknown {
    return (ctx: IContext, ...values: unknown[]) => {
      if (values.length != args.length)
        throw arityError(...ctx.get(0), values.length, args.length);
      const local = args.reduce((e, a, i) => ({ ...e, [a]: values[i] }), {});
      const result = this.prog(local, body);
      return result;
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

  value(ctx: IContext, v: unknown): unknown {
    return this.env.get(v);
  }

  known(ctx: IContext, v: unknown): unknown {
    if (this.env.has(v)) return this.value(ctx, v);
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
