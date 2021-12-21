<template>
  <a
    class="github-fork-ribbon right-top"
    href="https://github.com/ydarma/hey"
    data-ribbon="Contribuer sur GitHub"
    title="Contribuer sur GitHub"
  >
    Contribute on GitHub
  </a>
  <b-card class="fixed-top menu">
    <div class="d-flex">
      <div class="w-50">
        <b-button
          class="m-1 d-none d-lg-inline py-2 px-3"
          variant="success"
          to="/"
        >
          <b-icon size="lg" icon="house"></b-icon>
        </b-button>
        <table-of-content class="mx-1"></table-of-content>
        <b-button
          class="m-1 d-none d-lg-inline py-2 px-3"
          variant="info"
          to="/about"
        >
          <b-icon size="lg" icon="info-circle"></b-icon>
        </b-button>
      </div>
      <div>
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
.l {
  left: 50%;
}
.left-pill {
  border-top-left-radius: 50rem !important;
  border-bottom-left-radius: 50rem !important;
}

.main {
  margin-top: 100px;
}

.menu {
  height: 80px !important;
}

.github-fork-ribbon:before {
  background-color: #333;
}
</style>
