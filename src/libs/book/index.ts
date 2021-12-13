import ky from "ky";
import { markdown } from "./markdown";
import { tryit } from "./tryit";
import { solution } from "./solution";

function open(ref: string): Promise<string> {
  return ky(`/book/${ref}.md`)
    .text()
    .then((source) => markdown(source));
}

const toc = (process.env.VUE_APP_TOC as string)
  .split("\n")
  .map((c, i) => [c.replace(/.md$/, ""), i] as const);

export default {
  toc,
  open,
  tryit,
  solution,
};
