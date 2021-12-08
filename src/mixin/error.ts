import ohm from "ohm-js";

export type Error = {
  line: number;
  col: number;
  message: string;
};

function error(
  source: string,
  rule: string,
  pos: number,
  symbol?: unknown
): Error {
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

export function colorError(source: string, pos: number, symbol: string): Error {
  return error(source, "V<color>", pos, symbol);
}

export function numberError(
  source: string,
  pos: number,
  symbol: string
): Error {
  return error(source, "V<number>", pos, symbol);
}

export function identifierError(
  source: string,
  pos: number,
  symbol: string
): Error {
  return error(source, "identifier", pos, symbol);
}

export function matchError(source: string, match: ohm.MatchResult): Error {
  const pos = match.getRightmostFailurePosition();
  const infos = Object.keys(match.matcher.memoTable[pos].memo);
  const rule = infos[infos.length - 1];
  return error(source, rule, pos);
}
