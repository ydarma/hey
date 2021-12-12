<template>
  <div v-html="content"></div>
</template>

<script>
import { defineComponent } from "vue";
import book from "@/libs/book";
import { mapMutations } from "vuex";
import "@/assets/syntax.css";

export default defineComponent({
  data: function () {
    return {
      content: undefined,
    };
  },
  computed: {
    chapter() {
      const title = this.$route.query.chapter;
      return title ? title : "1. Introduction";
    },
  },
  methods: {
    ...mapMutations(["setProgram"]),
    async open() {
      this.content = await book.open(this.chapter);
      this.$nextTick(() => {
        book.tryit((source) => this.setProgram(source));
        book.solution();
      });
    },
  },
  watch: {
    async "$route.query.chapter"() {
      await this.open();
    },
  },
  async mounted() {
    await this.open();
  },
});
</script>
