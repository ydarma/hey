import ky from "ky";
import { markdown } from "./markdown";

export default function (ref: string): Promise<string> {
  return ky(`/book/${ref}.md`)
    .text()
    .then((source) => markdown(source));
}
