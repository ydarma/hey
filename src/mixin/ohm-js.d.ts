export * from "ohm-js";

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
