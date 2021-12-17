export type V<T> = string | T;

export class Env {
  private stack: Record<string, unknown>[] = [{}];

  pick(): Record<string, unknown> {
    const env = this.stack[this.stack.length - 1];
    if (typeof env == "undefined") throw "interval error: empty stack";
    return env;
  }

  has<T>(id: V<T>, scope: "local" | "global" = "global"): boolean {
    if (typeof id != "string") return false;
    if (scope == "local") return id in this.pick();
    return this.stack.some((env) => id in env);
  }

  get<T>(id: V<T>): T {
    return this.stack.reduce(
      (v, env) => (typeof id == "string" && id in env ? (env[id] as T) : v),
      id
    ) as T;
  }

  push(...local: { [id: string]: unknown }[]): void {
    this.stack.push(...local);
  }

  pop(count = 1): Record<string, unknown> {
    const env = this.stack.pop();
    if (typeof env == "undefined") throw "interval error: empty stack";
    return count == 1 ? env : this.pop(count - 1);
  }
}
