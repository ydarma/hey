<template>
  <div v-html="content"></div>
</template>

<script>
import { defineComponent } from "vue";
import book from "@/libs/book";
import { mapMutations, mapState } from "vuex";
import "@/assets/syntax.css";

export default defineComponent({
  data: function () {
    return {
      content: undefined,
    };
  },
  computed: {
    ...mapState(["chapter"]),
  },
  methods: {
    ...mapMutations(["setProgram"]),
    async open(title) {
      this.content = await book.open(title);
      this.$nextTick(() => {
        book.tryit((source) => this.setProgram(source));
        book.solution();
      });
    },
  },
  watch: {
    async chapter(title) {
      await this.open(title);
    },
  },
  async mounted() {
    this.content = null;
    if (this.chapter) await this.open(this.chapter);
  },
});
</script>
