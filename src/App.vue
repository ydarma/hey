<template>
  <a
    class="github-fork-ribbon right-top"
    href="https://github.com/ydarma/hey"
    data-ribbon="Contribuer sur GitHub"
    title="Contribuer sur GitHub"
  >
    Contribute on GitHub
  </a>
  <b-card class="menu">
    <div class="d-flex justify-content-between align-items-center">
      <layout-commands
        direction="h"
        @expand-left="disposition = 'left'"
        @balance="disposition = 'balance'"
        @expand-right="disposition = 'right'"
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
      <license-panel class="license"></license-panel>
    </div>
  </b-card>
  <div class="main">
    <router-view :disposition="disposition" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import "github-fork-ribbon-css/gh-fork-ribbon.css";
import TableOfContent from "@/components/TableOfContent.vue";
import LayoutCommands from "@/components/LayoutCommands.vue";
import LicensePanel from "@/components/LicensePanel.vue";

export default defineComponent({
  data() {
    return {
      disposition: "balance",
    };
  },
  components: {
    LayoutCommands,
    TableOfContent,
    LicensePanel,
  },
});
</script>

<style>
.main {
  position: fixed;
  top: 100px;
  bottom: 0;
  overflow-y: scroll;
  width: 100%;
}

.menu {
  position: fixed;
  top: 0;
  height: 80px !important;
}

.github-fork-ribbon:before {
  background-color: #333;
}

.license {
  margin-right: 60px;
}
</style>
