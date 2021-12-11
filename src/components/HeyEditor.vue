<template>
  <div>
    <div id="editor"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations, mapState } from "vuex";
import editor from "@/libs/editor";

export default defineComponent({
  name: "HeyEditor",
  props: [],
  data() {
    return { marker: 0 };
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
  beforeCreate() {
    this.$nextTick(() => {
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
  },
});
</script>
