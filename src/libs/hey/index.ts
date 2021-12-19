import ky from "ky";

import { heyLoader } from "./hey";
export { HeyError } from "./error";

export const { hey, cancel } = heyLoader(() => ky("/hey.ohm").text());
