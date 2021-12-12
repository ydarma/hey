<template>
  <div>
    <b-alert v-if="isError" variant="danger" show>
      {{ error }}
    </b-alert>
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
    <div v-if="isValue">
      {{ output }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  props: [],
  computed: {
    ...mapState(["output", "error"]),
    isArray() {
      return !this.isError && Array.isArray(this.output);
    },
    isValue() {
      return !this.isError && typeof this.output != "object";
    },
    isError() {
      return !!this.error;
    },
  },
});
</script>
