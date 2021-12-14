<template>
  <transition name="bounce">
    <b-alert v-if="isError" variant="danger" show>
      {{ error }}
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
.bounce-enter-active {
  animation: bounce-in 0.3s;
  transition: all 0.3s ease-out;
}
.bounce-enter-from {
  transform: translateX(200px);
  opacity: 0;
}
@keyframes bounce-in {
  0% {
    background-color: inherit;
  }
  50% {
    background-color: rgb(236, 246, 246);
  }
  100% {
    background-color: inherit;
  }
}
</style>
