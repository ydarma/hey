<template>
  <div>
    <b-alert v-if="isError" variant="danger" show>
      {{ error }}
    </b-alert>
    <hey-list v-else-if="isArray" :output="output"></hey-list>
    <hey-value v-else :output="output"></hey-value>
  </div>
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
    isError() {
      return !!this.error;
    },
  },
});
</script>
