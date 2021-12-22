<template>
  <b-button variant="danger" class="mx-3 my-1" pill @click="execute()">
    <b-icon size="lg" icon="play"></b-icon>
  </b-button>
  <b-button variant="secondary" class="mx-3" pill @click="cancel()">
    <b-icon size="lg" icon="x"></b-icon>
  </b-button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

export default defineComponent({
  emits: ["exec", "cancel"],
  methods: {
    ...mapActions(["exec", "clear"]),
    execute() {
      this.exec();
      this.$emit("exec");
    },
    cancel() {
      this.clear();
      this.$emit("cancel");
    },
  },
});
</script>
