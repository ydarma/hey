<template>
  <div class="body">
    <div class="main">
      <router-view :disposition="disposition" />
    </div>
    <contribute-github></contribute-github>
  </div>
  <div class="menu">
    <top-menu
      @expand-left="disposition = 'left'"
      @balance="disposition = 'balance'"
      @expand-right="disposition = 'right'"
    >
      <license-panel class="license"></license-panel>
    </top-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import "github-fork-ribbon-css/gh-fork-ribbon.css";
import ContributeGithub from "@/components/ContributeGithub.vue";
import TopMenu from "./components/TopMenu.vue";
import LicensePanel from "@/components/LicensePanel.vue";

export default defineComponent({
  data() {
    return {
      disposition: "balance",
    };
  },
  components: {
    TopMenu,
    LicensePanel,
    ContributeGithub,
  },
});
</script>

<style>
.body {
  overflow-y: scroll;
}
.main {
  position: absolute;
  top: 100px;
  bottom: 0;
  width: 100%;
}

.menu {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 80px !important;
}

.license {
  margin-right: 60px;
}
</style>
