import { Env, V } from "./env";
import { numberError, colorError, identifierError } from "./error";

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

  def(id: string, body: unknown): void {
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

  repeat(ctx: IContext, count: number, ...values: unknown[]): unknown[] {
    const result = new Array(count);
    for (let i = 0; i < count; i++) result[i] = values[i % values.length];
    return result;
  }

  fun(args: string[], body: () => unknown): (...values: unknown[]) => unknown {
    return (...value: unknown[]) => {
      const local = args.reduce((e, a, i) => ({ ...e, [a]: value[i] }), {});
      const result = this.prog(local, body);
      return result;
    };
  }

  call(id: string, ...values: unknown[]): unknown {
    const callable = this.env.get<(...a: unknown[]) => unknown | unknown[]>(id);
    return this.callSeq(callable, ...values);
  }

  callSeq(
    callable: (...a: unknown[]) => unknown | unknown[],
    ...values: unknown[]
  ): unknown {
    return Array.isArray(callable)
      ? callable[(values[0] as number) - 1]
      : callable(...values);
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
