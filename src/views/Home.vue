<template>
  <div class="home m-3 d-flex flex-row h-100">
    <div class="p-2 w-50">
      <book-viewer></book-viewer>
    </div>
    <div class="p-2 w-50">
      <div class="d-flex flex-column h-100 exec-pane">
        <div
          class="mb-2 border rounded p-1 editor"
          :class="{
            minimize: minimizeEditor,
            balance: !minimizeEditor && !minimizeOut,
            maximize: !minimizeEditor,
          }"
          ref="editor"
        >
          <HeyEditor />
        </div>
        <div>
          <b-button variant="danger" class="mx-3" pill @click="exec()">
            <b-icon size="lg" icon="play"></b-icon>
          </b-button>
          <b-button variant="secondary" class="mx-3" pill @click="clear()">
            <b-icon size="lg" icon="x"></b-icon>
          </b-button>
          <b-button-group class="mx-3">
            <b-button
              variant="info"
              class="left-pill"
              @click="maximizeEditor()"
            >
              <b-icon size="lg" icon="arrow-down"></b-icon>
              <b-icon size="lg" icon="fullscreen"></b-icon>
            </b-button>
            <b-button variant="info" @click="balance()">
              <b-icon size="lg" icon="fullscreen-exit"></b-icon>
            </b-button>
            <b-button variant="info" class="right-pill" @click="maximizeOut()">
              <b-icon size="lg" icon="fullscreen"></b-icon>
              <b-icon size="lg" icon="arrow-up"></b-icon>
            </b-button>
          </b-button-group>
        </div>
        <div
          class="p-2 result"
          :class="{
            minimize: minimizeOut,
            balance: !minimizeEditor && !minimizeOut,
            maximize: !minimizeOut,
          }"
        >
          <HeyOut />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeyEditor from "@/components/HeyEditor.vue";
import HeyOut from "@/components/HeyOut.vue";
import { mapActions } from "vuex";
import BookViewer from "@/components/BookViewer.vue";

export default defineComponent({
  name: "Home",
  data() {
    return {
      minimizeEditor: false,
      minimizeOut: false,
      editorHeight: 0,
    };
  },
  methods: {
    ...mapActions(["exec", "clear"]),
    maximizeEditor() {
      this.minimizeEditor = false;
      this.minimizeOut = true;
    },
    balance() {
      this.minimizeEditor = false;
      this.minimizeOut = false;
    },
    maximizeOut() {
      this.minimizeEditor = true;
      this.minimizeOut = false;
    },
  },
  components: {
    HeyEditor,
    HeyOut,
    BookViewer,
  },
});
</script>

<style>
.left-pill {
  border-top-left-radius: 50rem !important;
  border-bottom-left-radius: 50rem !important;
}

.right-pill {
  border-top-right-radius: 50rem !important;
  border-bottom-right-radius: 50rem !important;
}

.maximize {
  min-height: 80%;
  max-height: 90%;
}
.minimize {
  min-height: 5%;
  max-height: 15%;
}

.balance {
  min-height: 40%;
  max-height: 50%;
}

.exec-pane {
  position: fixed;
  right: 12px;
  left: 50%;
  overflow: scroll;
}
.exec-pane::-webkit-scrollbar {
  width: 4px;
}
/* Handle */
.exec-pane::-webkit-scrollbar-thumb {
  background: rgb(214, 168, 168);
}
/* Handle on hover */
.exec-pane::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
