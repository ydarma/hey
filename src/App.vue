<template>
  <a
    class="github-fork-ribbon right-top"
    href="https://github.com/ydarma/hey"
    data-ribbon="Contribute on GitHub"
    title="Contribute on GitHub"
  >
    Contribute on GitHub
  </a>
  <div class="d-flex flex-column h-100">
    <div id="nav">
      <b-card>
        <b-button class="mx-1" to="/">Home</b-button>
        <table-of-content></table-of-content>
        <b-button class="mx-1" variant="info" to="/about">About</b-button>
      </b-card>
    </div>
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
