import hljs from "highlight.js/lib/core";
import { marked } from "marked";
import syntax from "./syntax";

export function markdown(source: string): string {
  hljs.registerLanguage("hey", syntax);
  const result = marked.setOptions({
    highlight: (code, lang) => {
      return hljs.highlight(lang, code).value;
    },
  })(source);
  return result;
}
