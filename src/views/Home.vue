<template>
  <div
    class="d-flex flex-column h-100 sandbox"
    :class="{
      even: disposition == 'even',
      max: disposition == 'right',
      min: disposition == 'left',
    }"
  >
    <div
      class="mb-2 border rounded p-1 editor"
      :class="{
        even: layout == 'even',
        min: layout == 'bottom',
        max: layout == 'top',
      }"
    >
      <HeyEditor />
    </div>
    <div class="mb-1">
      <exec-commands @exec="balance()"> </exec-commands>
      <layout-commands
        direction="v"
        @expand-down="layout = 'top'"
        @even="layout = 'even'"
        @expand-up="layout = 'bottom'"
      >
      </layout-commands>
    </div>
    <div
      class="p-2 result out"
      :class="{
        even: layout == 'even',
        min: layout == 'top',
        max: layout == 'bottom',
      }"
    >
      <HeyOut />
    </div>
  </div>

  <div
    class="px-5 book"
    :class="{
      even: disposition == 'even',
      max: disposition == 'left',
      min: disposition == 'right',
    }"
  >
    <book-viewer></book-viewer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeyEditor from "@/components/HeyEditor.vue";
import HeyOut from "@/components/HeyOut.vue";
import BookViewer from "@/components/BookViewer.vue";
import LayoutCommands from "@/components/LayoutCommands.vue";
import ExecCommands from "@/components/ExecCommands.vue";

export default defineComponent({
  name: "Home",
  props: ["disposition"],
  data() {
    return {
      layout: "even",
      editorHeight: 0,
    };
  },
  methods: {
    balance() {
      if (this.layout == "top") this.layout = "even";
    },
  },
  components: {
    LayoutCommands,
    HeyEditor,
    HeyOut,
    BookViewer,
    ExecCommands,
  },
});
</script>

<style>
.book {
  position: absolute;
  right: 0;
}

.book.even {
  left: 40%;
}

.book.min {
  display: none;
}

.book.max {
  left: 0;
}

.sandbox {
  position: fixed;
  left: 20px;
}

.sandbox.even {
  right: 60%;
}

.book.min {
  display: none;
}

.sandbox.max {
  right: 20px;
}

.editor.max,
.out.max {
  min-height: 80%;
  max-height: 90%;
}

.editor.min,
.out.min {
  display: none;
}

.editor.even,
.out.even {
  min-height: 40%;
  max-height: 50%;
}

.out {
  overflow-y: scroll;
}

.out::-webkit-scrollbar {
  width: 4px;
}
/* Handle */
.out::-webkit-scrollbar-thumb {
  background: rgb(214, 168, 168);
}
/* Handle on hover */
.out::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
