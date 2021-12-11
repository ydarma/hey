import ky from "ky";

import { heyLoader } from "./hey";
export { HeyError } from "./error";

export default heyLoader(() => ky("/hey.ohm").text());
