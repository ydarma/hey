import { Language } from "highlight.js";
import { syntaxClasses } from "./syntaxClasses";

export default function (): Language {
  return {
    name: "hey",
    contains: syntaxClasses.map((c) => ({
      className: c.className,
      begin: c.regex,
    })),
  };
}
