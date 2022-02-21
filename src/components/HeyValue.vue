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
import { isVector } from "@/libs/hey/vector";
import { defineComponent } from "vue";

export default defineComponent({
  props: ["output"],
  computed: {
    isValue() {
      return !this.isShape;
    },
    isFunction() {
      return this.isValue && typeof this.output == "function";
    },
    isShape() {
      return this.output instanceof Shape;
    },
    isVector() {
      return isVector(this.output);
    },
  },
});
</script>

<style>
.fun {
  font-family: monospace;
}
</style>
