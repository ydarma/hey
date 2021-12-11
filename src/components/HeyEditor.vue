<template>
  <div>
    <div id="editor"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import ace from "ace-builds";
import "ace-builds/webpack-resolver";
import { mapMutations, mapState } from "vuex";
import { HeyError } from "@/mixin/error";

const oop = ace.require("ace/lib/oop");
const TextMode = ace.require("ace/mode/text").Mode;
const TextHighlightRules = ace.require(
  "ace/mode/text_highlight_rules"
).TextHighlightRules;

const HeyHighlightRules = function (this: { $rules: unknown }) {
  this.$rules = {
    start: [
      {
        token: "comment",
        regex: ";.*$",
      },
      {
        token: "constant.language",
        regex: /\b(def)\b/,
      },
      {
        token: "constant",
        regex: /\bgreen|blue|yellow|red|purple|grey|black|white\b/,
      },
      {
        token: "keyword",
        regex: /\b(range|square|concat|c|repeat|r|slice|s)\b/,
      },
      {
        token: "constant.numeric",
        regex: /[+-]?\d+/,
      },
      {
        token: "keyword.operator",
        regex: /[():]|->/,
      },
      {
        token: "string",
        regex: /"/,
        next: "qqstring",
      },
    ],
    qqstring: [
      {
        token: "string",
        regex: /""/,
      },
      {
        token: "string",
        regex: /[^"]+/,
      },
      {
        token: "string",
        regex: /"/,
        next: "start",
      },
    ],
  };
};

oop.inherits(HeyHighlightRules, TextHighlightRules);

var Mode = function (this: { HighlightRules: unknown }) {
  this.HighlightRules = HeyHighlightRules;
} as unknown as { new (): ace.Ace.SyntaxMode };

oop.inherits(Mode, TextMode);

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
  emits: ["change"],
  setup() {
    let resolve: (e: ace.Ace.Editor) => void;
    let editor: Promise<ace.Ace.Editor> = new Promise((r) => (resolve = r));
    onMounted(() => {
      const editor = ace.edit("editor", {
        maxLines: 20,
        fontSize: 16,
      });
      editor.session.setMode(new Mode());
      resolve(editor);
    });
    let marker = 0;
    return {
      edit: (prog: string) =>
        editor.then((ed) => {
          const current = ed.session.getValue();
          if (current != prog) ed.session.setValue(prog);
        }),
      onChange: (handler: (prog: string) => void) =>
        editor.then((ed) => {
          ed.on("change", () => handler(ed.session.getValue()));
        }),
      setError: (err: HeyError) =>
        editor.then((ed) => {
          ed.session.removeMarker(marker);
          marker = 0;
          if (err) {
            const range = new ace.Range(
              err.line - 1,
              err.col - 1,
              err.line - 1,
              err.col + 2
            );
            marker = ed.session.addMarker(
              range,
              "alert alert-danger err py-2",
              "text"
            );
          }
        }),
    };
  },
  beforeCreate() {
    this.$nextTick(() => {
      this.edit(this.program);
      this.onChange((prog: string) => this.setProgram(prog));
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

<style>
#editor {
  height: 700px;
}
.err:before {
  content: "~~~~~~~~~~~~";
  font-size: 1em;
  font-weight: 900;
  font-family: Times New Roman, Serif;
  color: red;
  width: 100%;
  position: absolute;
  top: 0.7em;
  left: -1px;
  overflow: hidden;
}
</style>
