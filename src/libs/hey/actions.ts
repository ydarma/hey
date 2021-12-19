import { b } from "./bernouilli";
import { Env, V } from "./env";
import {
  numberError,
  colorError,
  identifierError,
  callError,
  arityError,
  dataError,
  alreadyDefError,
  interruptionError,
} from "./error";
import { Shape } from "./shape";

export interface IContext {
  get(index: number): [string, number];
}

export class HeyActions {
  private readonly env = new Env();
  private _cancel = false;

  cancel(): void {
    this._cancel = true;
  }

  prog<T>(
    ctx: IContext,
    local: Record<string, unknown>[],
    body: (ctx: IContext) => Promise<T>
  ): Promise<T> {
    this.env.push(...local);
    if (this._cancel) {
      this._cancel = false;
      throw interruptionError(...ctx.get(0));
    }
    return new Promise((r) =>
      setTimeout(() =>
        r(
          body(ctx).finally(() => {
            this.env.pop(local.length);
          })
        )
      )
    );
  }

  def(ctx: IContext, id: string, body: unknown): void {
    if (this.env.has(id, "local")) throw alreadyDefError(...ctx.get(0), id);
    this.env.pick()[id] = body;
  }

  range(
    ctx: IContext,
    count: V<number>,
    start: V<number>,
    step?: V<number>
  ): number[] {
    if (!isNumber(count)) throw numberError(...ctx.get(0), count);
    if (!isNumber(start)) throw numberError(...ctx.get(1), start);
    if (typeof step != "undefined" && !isNumber(step))
      throw numberError(...ctx.get(2), step);
    const result = [];
    for (let i = 0; i < count; i++) result.push(i * (step ?? 1) + start);
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
    return data.slice(
      start > 0 ? start - 1 : start,
      end && end < 0 ? end + 1 : end
    );
  }

  length(ctx: IContext, data: V<unknown[]>): number {
    if (!isData(data)) throw dataError(...ctx.get(0), data);
    return data.length;
  }

  funct<T>(
    ctx: IContext,
    args: string[],
    body: (ctx: IContext) => Promise<T>
  ): (ctx: IContext, ...values: unknown[]) => Promise<T> {
    const capture = this.env.pick();
    return async (ctx: IContext, ...values: unknown[]) => {
      if (values.length != args.length)
        throw arityError(...ctx.get(0), values.length, args.length);
      const local = args.reduce((e, a, i) => ({ ...e, [a]: values[i] }), {});
      return await this.prog(ctx, [capture, local], body);
    };
  }

  async result(
    ctx: IContext,
    callable: V<(ctx: IContext, ...a: unknown[]) => unknown | unknown[]>,
    ...values: unknown[]
  ): Promise<unknown> {
    const f = await callable;
    if (isData(f)) {
      const x = values[0] as number;
      return x > 0 && x <= f.length ? f[x - 1] : values[1];
    }
    if (isFunction(f)) return f(ctx, ...values);
    throw callError(...ctx.get(0));
  }

  known(ctx: IContext, v: unknown): unknown {
    if (this.env.has(v)) return this.env.get(v);
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
