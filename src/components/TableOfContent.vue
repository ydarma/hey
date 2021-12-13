<template>
  <b-dropdown id="dropdown-1" text="Table des matières" class="m-md-2">
    <b-dropdown-item-button
      v-for="(chapter, ix) in chapters"
      :key="'ch' + ix"
      @click="open(chapter)"
    >
      {{ chapter }}
    </b-dropdown-item-button>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-item-button
      v-for="(appendix, ix) in appendices"
      :key="'ap' + ix"
      @click="open(appendix)"
    >
      {{ appendix }}
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations } from "vuex";

export default defineComponent({
  props: [],
  computed: {
    chapters() {
      return this.toc.filter((t) => /^\d/.test(t));
    },
    appendices() {
      return this.toc.filter((t) => /^[A-Z]/.test(t));
    },
  },
  setup() {
    const toc = (process.env.VUE_APP_TOC as string)
      .split("\n")
      .map((c) => c.replace(/.md$/, ""));
    return { toc };
  },
  methods: {
    ...mapMutations(["setChapter"]),
    open(chapter: string) {
      this.$router.push({ path: "/", query: { chapter } });
    },
  },
});
</script>

<style>
table {
  width: 100%;
}
table th,
table td {
  border-left: 1px solid #000;
  border-spacing: 10px;
  padding-left: 10px;
}
</style>
