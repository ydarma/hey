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
  },
  watch: {
    async chapter(title) {
      this.content = await book.open(title);
    },
  },
  async mounted() {
    this.content = null;
    if (this.chapter) {
      this.content = await book.open(this.chapter);
      this.$nextTick(() => {
        book.tryit((source) => this.setProgram(source));
      });
    }
  },
});
</script>
