export type V<T> = string | T;

export class Env {
  private stack: Record<string, unknown>[] = [{}];

  pick(): Record<string, unknown> {
    const env = this.stack[this.stack.length - 1];
    if (typeof env == "undefined") throw "interval error: empty stack";
    return env;
  }

  has<T>(id: V<T>): boolean {
    return typeof id == "string" && id in this.pick();
  }

  get<T>(id: V<T>): T {
    return (
      typeof id == "string" && id in this.pick() ? this.pick()[id] : id
    ) as T;
  }

  push(local: { [id: string]: unknown }): void {
    this.stack.push({ ...this.pick(), ...local });
  }

  pop(): Record<string, unknown> {
    const env = this.stack.pop();
    if (typeof env == "undefined") throw "interval error: empty stack";
    return env;
  }
}
