<template>
  <div class="d-flex flex-row flex-wrap">
    <div class="paren m-1">(</div>
    <div
      v-for="(out, ix) in output"
      :key="ix"
      class="m-1"
      :class="{ 'text-secondary': ix % 2 == 0, 'text-dark': ix % 2 == 1 }"
    >
      <hey-value :output="out"></hey-value>
    </div>
    <div class="paren m-1">)</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeyValue from "./HeyValue.vue";

export default defineComponent({
  components: { HeyValue },
  props: {
    output: Array,
  },
});
</script>
