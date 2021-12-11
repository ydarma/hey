import ace from "ace-builds";
import "ace-builds/webpack-resolver";
import { syntaxClasses } from "../book/syntaxClasses";
const oop = ace.require("ace/lib/oop");
const TextMode = ace.require("ace/mode/text").Mode;
const TextHighlightRules = ace.require(
  "ace/mode/text_highlight_rules"
).TextHighlightRules;

const HeyHighlightRules = function (this: { $rules: unknown }) {
  this.$rules = {
    start: syntaxClasses.map((c) => ({ token: c.className, regex: c.regex })),
  };
};

oop.inherits(HeyHighlightRules, TextHighlightRules);

export const Mode = function (this: { HighlightRules: unknown }) {
  this.HighlightRules = HeyHighlightRules;
} as unknown as { new (): ace.Ace.SyntaxMode };

oop.inherits(Mode, TextMode);
