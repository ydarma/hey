import ky from "ky";
import { markdown } from "./markdown";
import { tryit } from "./tryit";

function open(ref: string): Promise<string> {
  return ky(`/book/${ref}.md`)
    .text()
    .then((source) => markdown(source));
}

export default {
  open,
  tryit,
};
