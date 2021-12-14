<template>
  <transition :name="isError ? 'err-bounce' : 'out-bounce'">
    <b-alert v-if="isError" variant="danger" class="error" show>
      [{{ error.line }}:{{ error.col }}] {{ error.message }}
    </b-alert>
    <hey-list v-else-if="isArray" :output="output"></hey-list>
    <hey-value v-else-if="isValue" :output="output"></hey-value>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import HeyList from "./HeyList.vue";
import HeyValue from "./HeyValue.vue";

export default defineComponent({
  components: { HeyValue, HeyList },
  props: [],
  computed: {
    ...mapState(["output", "error"]),
    isArray() {
      return !this.isError && Array.isArray(this.output);
    },
    isValue() {
      return !this.isError && !!this.output;
    },
    isError() {
      return !!this.error;
    },
  },
});
</script>

<style>
fade-enter-active,
.out-bounce-enter-active {
  animation: bounce-in 0.5s;
}
.err-bounce-enter-active,
.out-bounce-enter-active {
  transition: transform 0.3s ease-out;
}
.err-bounce-leave-active,
.out-bounce-leave-active {
  transition: opacity 0.3s ease-out;
}
.err-bounce-enter-from,
.out-bounce-enter-from {
  transform: translateX(200px);
}
.err-bounce-enter-from,
.err-bounce-leave-to,
.out-bounce-enter-from,
.out-bounce-leave-to {
  opacity: 0;
}
@keyframes bounce-in {
  0% {
    background-color: inherit;
  }
  50% {
    background-color: rgb(240, 246, 240);
  }
  100% {
    background-color: inherit;
  }
}
</style>
