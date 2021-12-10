<template>
  <div>
    <div id="editor" @change="onChange()"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import ace from "ace-builds";
import "ace-builds/webpack-resolver";

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
  props: {
    program: String,
    error: Object,
  },
  data() {
    return { marker: 0 };
  },
  name: "HeyEditor",
  emits: ["change"],
  setup(props, ctx) {
    let resolve: (e: ace.Ace.Editor) => void;
    let editor: Promise<ace.Ace.Editor> = new Promise((r) => (resolve = r));
    onMounted(() => {
      const editor = ace.edit("editor", {
        maxLines: 50,
        value: props.program,
        fontSize: 16,
      });
      editor.session.setMode(new Mode());
      editor.on("change", () => ctx.emit("change", editor.session.getValue()));
      resolve(editor);
    });
    return { editor };
  },
  watch: {
    async error(e) {
      (await this.editor).session.removeMarker(this.marker);
      this.marker = 0;
      if (e) {
        const range = new ace.Range(
          e.line - 1,
          e.col - 1,
          e.line - 1,
          e.col + 2
        );
        this.marker = (await this.editor).session.addMarker(
          range,
          "alert alert-danger err py-2",
          "text"
        );
      }
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
