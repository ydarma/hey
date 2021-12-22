<template>
  <b-card>
    <div class="d-flex justify-content-between align-items-center">
      <layout-commands
        direction="h"
        @expand-left="$emit('expand-left')"
        @even="$emit('even')"
        @expand-right="$emit('expand-right')"
      ></layout-commands>
      <div class="toc mx-5 d-flex align-items-center">
        <b-button class="m-1 d-none d-lg-inline px-3" variant="success" to="/">
          <b-icon size="lg" icon="house"></b-icon>
        </b-button>
        <table-of-content class="mx-1"></table-of-content>
        <b-button
          class="m-1 d-none d-lg-inline px-3"
          variant="info"
          to="/about"
        >
          <b-icon size="lg" icon="info-circle"></b-icon>
        </b-button>
      </div>
      <slot></slot>
    </div>
  </b-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TableOfContent from "@/components/TableOfContent.vue";
import LayoutCommands from "@/components/LayoutCommands.vue";

export default defineComponent({
  components: {
    LayoutCommands,
    TableOfContent,
  },
});
</script>

<style scoped></style>
