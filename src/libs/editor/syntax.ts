import ace from "ace-builds";
import "ace-builds/webpack-resolver";
const oop = ace.require("ace/lib/oop");
const TextMode = ace.require("ace/mode/text").Mode;
const TextHighlightRules = ace.require(
  "ace/mode/text_highlight_rules"
).TextHighlightRules;

const HeyHighlightRules = function (this: { $rules: unknown }) {
  this.$rules = {
    start: [
      {
        token: "comment",
        regex: ";.*$",
      },
      {
        token: "constant.language",
        regex: /\b(def)\b/,
      },
      {
        token: "constant",
        regex: /\bgreen|blue|yellow|red|purple|grey|black|white\b/,
      },
      {
        token: "keyword",
        regex: /\b(range|square|concat|c|repeat|r|slice|s)\b/,
      },
      {
        token: "constant.numeric",
        regex: /[+-]?\d+/,
      },
      {
        token: "keyword.operator",
        regex: /[():]|->/,
      },
      {
        token: "string",
        regex: /"/,
        next: "qqstring",
      },
    ],
    qqstring: [
      {
        token: "string",
        regex: /""/,
      },
      {
        token: "string",
        regex: /[^"]+/,
      },
      {
        token: "string",
        regex: /"/,
        next: "start",
      },
    ],
  };
};

oop.inherits(HeyHighlightRules, TextHighlightRules);

export const Mode = function (this: { HighlightRules: unknown }) {
  this.HighlightRules = HeyHighlightRules;
} as unknown as { new (): ace.Ace.SyntaxMode };

oop.inherits(Mode, TextMode);
