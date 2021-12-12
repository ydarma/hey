<template>
  <div>
    <b-alert v-if="isError()" variant="danger" show>
      {{ error }}
    </b-alert>
    <div v-if="isArray()" class="d-flex flex-row flex-wrap">
      <div class="paren m-1">(</div>
      <div
        v-for="(value, ix) in output"
        :key="ix"
        class="m-1"
        :class="{ 'text-secondary': ix % 2 == 0, 'text-dark': ix % 2 == 1 }"
      >
        <div v-if="isValue(value)">
          {{ value }}
        </div>
        <div v-if="isShape(value)" v-html="value"></div>
      </div>
      <div class="paren m-1">)</div>
    </div>
    <div v-if="isValue()">
      {{ output }}
    </div>
    <div v-if="isShape()" v-html="output"></div>
  </div>
</template>

<script lang="ts">
import { Shape } from "@/libs/hey/shape";
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  props: [],
  computed: {
    ...mapState(["output", "error"]),
  },
  methods: {
    isArray(out: unknown) {
      return !this.isError() && Array.isArray(out ? out : this.output);
    },
    isValue(out: unknown) {
      return (
        !this.isError() &&
        !this.isShape(out) &&
        typeof (out ? out : this.output) != "object"
      );
    },
    isShape(out: unknown) {
      return !this.isError() && (out ? out : this.output) instanceof Shape;
    },
    isError() {
      return !!this.error;
    },
  },
});
</script>
