<template>
  <div>
    <div v-if="isValue" :class="{ fun: isFunction }">
      {{ output }}
    </div>
    <div v-if="isShape" v-html="output" class="shape"></div>
  </div>
</template>

<script lang="ts">
import { Shape } from "@/libs/hey/shape";
import { defineComponent } from "vue";

export default defineComponent({
  props: ["output"],
  computed: {
    isValue() {
      return !this.isShape && typeof this.output != "object";
    },
    isFunction() {
      return this.isValue && typeof this.output == "function";
    },
    isShape() {
      return this.output instanceof Shape;
    },
  },
});
</script>

<style>
.fun {
  font-family: monospace;
}
</style>
