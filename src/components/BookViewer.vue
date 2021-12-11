<template>
  <div v-html="content"></div>
</template>

<script>
import { defineComponent } from "vue";
import book from "@/libs/book";
import { mapMutations, mapState } from "vuex";
import $ from "cash-dom";
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
      this.content = await book(title);
    },
  },
  async mounted() {
    this.content = null;
    if (this.chapter) {
      this.content = await book(this.chapter);
      this.$nextTick(() => {
        const t = $(".language-hey").parent();
        t.each((_, e) => {
          $(e).append(
            $("<button/>")
              .text("Try it")
              .addClass("btn btn-outline-primary btn-sm m-2")
              .on({
                click: () => {
                  this.setProgram($(e).find("code").prop("innerText").trim());
                },
              })
          );
        });
      });
    }
  },
});
</script>
