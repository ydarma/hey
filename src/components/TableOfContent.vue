<template>
  <b-button-group class="mx-2">
    <b-button
      variant="secondary"
      :disabled="this.previous === false"
      @click="open(previous)"
    >
      <b-icon icon="arrow-left"></b-icon>
    </b-button>
    <b-dropdown id="dropdown-1">
      <template #button-content>
        <b-icon size="lg" icon="book"></b-icon>
      </template>
      <b-dropdown-item-button
        v-for="[chapter, ix] in chapters"
        :key="ix"
        @click="open(ix)"
      >
        {{ chapter }}
      </b-dropdown-item-button>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item-button
        v-for="[appendix, ix] in appendices"
        :key="'ap' + ix"
        @click="open(ix)"
      >
        {{ appendix }}
      </b-dropdown-item-button>
    </b-dropdown>
    <b-button
      variant="secondary"
      :disabled="this.next === false"
      @click="open(next)"
    >
      <b-icon icon="arrow-right"></b-icon>
    </b-button>
  </b-button-group>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations } from "vuex";
import book from "@/libs/book";

export default defineComponent({
  props: [],
  data: function () {
    return {
      current: 0,
    };
  },
  computed: {
    chapters() {
      return book.toc.filter(([t]) => /^\d/.test(t));
    },
    appendices() {
      return book.toc.filter(([t]) => /^[A-Z]/.test(t));
    },
    previous() {
      return this.current > 0 ? this.current - 1 : false;
    },
    next() {
      return this.current < book.toc.length - 1 ? this.current + 1 : false;
    },
    title() {
      return this.$route.query.title;
    },
  },
  methods: {
    ...mapMutations(["setChapter"]),
    open(ix: number) {
      this.current = ix;
      this.$router.push({ path: "/", query: { title: book.toc[ix][0] } });
    },
  },
  watch: {
    title(val) {
      this.current = book.toc.findIndex(([t]) => t == val);
    },
  },
});
</script>
