import ky from "ky";
import { defineComponent } from "vue";

import { heyLoader } from "./hey";

export const hey = heyLoader(() => ky("/hey.ohm").text());
export default defineComponent({
  getter: {
    hey,
  },
});
