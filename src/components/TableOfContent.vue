<template>
  <b-dropdown id="dropdown-1" text="Table des matières" class="m-md-2">
    <b-dropdown-item-button
      v-for="(chapter, ix) in toc"
      :key="ix"
      @click="open(chapter)"
    >
      {{ chapter }}
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations } from "vuex";

export default defineComponent({
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
