<template>
  <a
    class="github-fork-ribbon right-top"
    href="https://github.com/ydarma/hey"
    data-ribbon="Contribuer sur GitHub"
    title="Contribuer sur GitHub"
  >
    Contribute on GitHub
  </a>
  <div class="d-flex flex-column h-100">
    <b-card class="sticky-top">
      <b-button class="mx-1" variant="success" to="/">
        <b-icon icon="house"></b-icon>
      </b-button>
      <table-of-content class="mx-1"></table-of-content>
      <b-button class="mx-1" variant="info" to="/about">A propos</b-button>
    </b-card>
    <router-view class="flex-fill" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import "github-fork-ribbon-css/gh-fork-ribbon.css";
import TableOfContent from "@/components/TableOfContent.vue";

export default defineComponent({
  components: {
    TableOfContent,
  },
});
</script>

<style>
.github-fork-ribbon:before {
  background-color: #333;
}
</style>
