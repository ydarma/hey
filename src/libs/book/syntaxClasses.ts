export const syntaxClasses = [
  {
    className: "comment",
    regex: ";.*$",
  },
  {
    className: "string",
    regex: /".*[^"]("")*"/,
  },
  {
    className: "number",
    regex: /[+-]?\d+/,
  },
  {
    className: "def",
    regex: /\bdef\b/,
  },
  {
    className: "constant",
    regex: /\b(green|blue|yellow|red|purple|grey|black|white)\b/,
  },
  {
    className: "operator",
    regex: /[():]|->/,
  },
  {
    className: "keyword",
    regex: /\b(range|square|concat|c|repeat|r|slice|s)\b/,
  },
];
