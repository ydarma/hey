import ohm from "ohm-js";

export type HeyError = {
  line: number;
  col: number;
  message: string;
};

function error(
  source: string,
  pos: number,
  rule: string,
  symbol?: unknown
): HeyError {
  const { line, col, tok } = getLineCol(pos);
  return {
    line: line,
    col: col,
    message: `expected ${rule}, got ${symbol ?? tok}`,
  };

  function getLineCol(pos: number) {
    const sofar = source.substring(0, pos + 1);
    const lines = sofar.split(/\r\n|\r|\n/g);
    const line = lines.length;
    const col = lines[lines.length - 1].length;
    const tok = sofar.slice(-1);
    return { line, col, tok };
  }
}

export function colorError(
  source: string,
  pos: number,
  symbol: string
): HeyError {
  return error(source, pos, "color", symbol);
}

export function numberError(
  source: string,
  pos: number,
  symbol: string
): HeyError {
  return error(source, pos, "number", symbol);
}

export function callError(
  source: string,
  pos: number,
  symbol?: string
): HeyError {
  return error(source, pos, "function or data", symbol);
}

export function dataError(
  source: string,
  pos: number,
  symbol?: string
): HeyError {
  return error(source, pos, "data", symbol);
}

export function identifierError(
  source: string,
  pos: number,
  symbol: string
): HeyError {
  return error(source, pos, "identifier", symbol);
}

export function arityError(
  source: string,
  pos: number,
  actual: number,
  expected: number
): HeyError {
  return error(source, pos, `${expected} argument(s)`, actual);
}

export function matchError(source: string, match: ohm.MatchResult): HeyError {
  const pos = match.getRightmostFailurePosition();
  const infos = Object.keys(match.matcher.memoTable[pos].memo);
  const rule = infos[infos.length - 1];
  return error(source, pos, rule);
}

export function alreadyDefError(
  source: string,
  pos: number,
  symbol: string
): HeyError {
  return error(source, pos, "new identifier", symbol);
}
