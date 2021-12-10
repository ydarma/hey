<template>
  <div class="home m-3 d-flex flex-row h-100">
    <div class="p-2 w-50"></div>
    <div class="p-2 w-50">
      <div class="d-flex flex-column h-100">
        <div class="p-2">
          <b-button variant="danger" @click="exec()">
            <b-icon icon="play"></b-icon>run
          </b-button>
        </div>
        <HeyEditor
          :program="program"
          :error="error"
          @change="program = $event"
          class="p-2 flex-fill"
        />
        <div class="p-2 flex-fill">
          <HeyOut :stdout="output" :stderr="error" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeyEditor from "@/components/HeyEditor.vue";
import HeyOut from "@/components/HeyOut.vue";
import { hey } from "@/mixin/hey";

export default defineComponent({
  name: "Home",
  data() {
    return {
      program: '; example\ndef greetings r(70 "Hello world" green)\ngreetings',
      output: "" as unknown,
      error: undefined as unknown,
    };
  },
  methods: {
    exec() {
      this.error = undefined;
      try {
        this.output = hey(this.program);
      } catch (e) {
        this.error = e;
      }
    },
  },
  components: {
    HeyEditor,
    HeyOut,
  },
});
</script>
