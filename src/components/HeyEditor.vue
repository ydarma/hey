<template>
  <div class="h-100" ref="container">
    <div id="editor"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations, mapState } from "vuex";
import editor from "@/libs/editor";
import "@/assets/syntax.css";

export default defineComponent({
  name: "HeyEditor",
  props: [],
  data() {
    return {
      marker: 0,
      height: 0,
    };
  },
  computed: {
    ...mapState(["error", "program"]),
  },
  methods: {
    ...mapMutations(["setProgram"]),
  },
  setup() {
    return editor();
  },
  updated() {
    this.height = (this.$refs.editor as HTMLElement).clientHeight;
    console.log(this.height);
  },
  beforeCreate() {
    this.$nextTick(() => {
      const resizeObserver = new ResizeObserver(() => {
        this.resize((this.$refs.container as HTMLElement).clientHeight);
      });

      resizeObserver.observe(this.$refs.container as HTMLElement);
      this.edit(this.program);
      this.onChange((prog: string | undefined) => this.setProgram(prog));
    });
  },
  watch: {
    async error(err) {
      this.setError(err);
    },
    async program(prog) {
      this.edit(prog);
    },
    height(val) {
      this.resize(val);
    },
  },
});
</script>
