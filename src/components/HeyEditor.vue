<template>
  <div>
    <h2>This is an Hey editor</h2>
    <div id="editor"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import ace from "ace-builds";
import "ace-builds/webpack-resolver";

export default defineComponent({
  name: "HeyEditor",
  setup() {
    let editor;
    onMounted(() => {
      editor = ace.edit("editor", {
        maxLines: 50,
        minLines: 50,
        value: "var hello = 'world'" + "\n",
        mode: "ace/mode/javascript",
      });
    });
    return { editor };
  },
});
</script>

<style>
#editor {
  height: 700px;
}
</style>
