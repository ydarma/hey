<template>
  <div v-if="isArray" class="d-flex flex-row flex-wrap">
    <div class="paren">(</div>
    <div
      v-for="(value, ix) in output"
      :key="ix"
      class="mx-1"
      :class="{ 'text-secondary': ix % 2 == 0, 'text-dark': ix % 2 == 1 }"
    >
      {{ value }}
    </div>
    <div v-if="isArray" class="paren">)</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    output: Array,
  },
  computed: {
    isArray() {
      return Array.isArray(this.output);
    },
  },
});
</script>
