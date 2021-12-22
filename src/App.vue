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
      <b-button-group>
        <b-button
          variant="success"
          class="left-pill"
          @click="disposition = 'left'"
        >
          <b-icon size="lg" icon="box-arrow-left"></b-icon>
        </b-button>
        <b-button variant="success" @click="disposition = 'balance'">
          <b-icon size="lg" icon="vr"></b-icon>
        </b-button>
        <b-button
          variant="success"
          class="right-pill"
          @click="disposition = 'right'"
        >
          <b-icon size="lg" icon="box-arrow-right"></b-icon>
        </b-button>
      </b-button-group>
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
      <div class="license d-flex align-items-center">
        <a
          rel="license"
          href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
          ><img
            alt="Creative Commons License"
            style="border-width: 0"
            src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
        /></a>
        <span class="d-none d-xl-inline">
          This work is licensed under a
          <a
            rel="license"
            href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
            >Creative Commons Attribution-NonCommercial-ShareAlike 4.0
            International License</a
          ></span
        >
      </div>
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

export default defineComponent({
  data() {
    return {
      disposition: "balance",
    };
  },
  components: {
    TableOfContent,
  },
});
</script>

<style>
.left-pill {
  border-top-left-radius: 50rem !important;
  border-bottom-left-radius: 50rem !important;
}

.right-pill {
  border-top-right-radius: 50rem !important;
  border-bottom-right-radius: 50rem !important;
}

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
  max-width: 37em;
  font-size: 80%;
  margin-right: 60px;
}

.license img {
  margin-right: 3px;
}
</style>
