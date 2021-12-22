<template>
  <div v-html="content" class="viewer"></div>
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
    title() {
      const title = this.$route.query.title;
      return title ? title : book.toc[0][0];
    },
  },
  methods: {
    ...mapMutations(["setProgram"]),
    async open() {
      this.content = await book.open(this.title);
      this.$nextTick(() => {
        book.initInteractions((source) => this.setProgram(source));
      });
    },
  },
  watch: {
    async "$route.query.title"() {
      await this.open();
    },
  },
  async mounted() {
    await this.open();
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
.ascii {
  line-height: 0.8em;
  overflow: visible;
}
</style>
