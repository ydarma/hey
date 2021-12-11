import test from "tape";
import hljs from "highlight.js/lib/core";
import hey from "./syntax";

test("hey keywords", (t) => {
  const source = '; example\ndef val r(70 "hey ""world""" blue)\nval';
  hljs.registerLanguage("hey", hey);
  const result = hljs.highlight(source, { language: "hey" }).value;
  t.true(/hljs-comment/.test(result));
  t.true(/hljs-def/.test(result));
  t.true(/hljs-number/.test(result));
  t.true(/hljs-string/.test(result));
  t.true(/hljs-constant/.test(result));
  t.true(/hljs-operator/.test(result));
  t.end();
});
