import test from "tape";
import { markdown } from "./markdown";

test("syntax highlighting", (t) => {
  const source =
    'code example:\r\n\r\n```hey\n; example\ndef val r(70 "hey ""world""" blue)\nval```\n\n';
  const result = markdown(source);
  t.true(/language-hey/.test(result));
  t.end();
});
