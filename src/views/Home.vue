<template>
  <div class="home m-3 d-flex flex-row h-100">
    <div
      class="px-5 sandbox"
      :class="{
        'w-50': disposition == 'balance',
        'w-100': disposition == 'right',
        invisible: disposition == 'left',
      }"
    >
      <div class="d-flex flex-column h-100">
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
          <b-button variant="danger" class="mx-3" pill @click="execute()">
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
              <b-icon size="lg" icon="box-arrow-down"></b-icon>
            </b-button>
            <b-button variant="info" @click="balance()">
              <b-icon size="lg" icon="hr"></b-icon>
            </b-button>
            <b-button variant="info" class="right-pill" @click="maximizeOut()">
              <b-icon size="lg" icon="box-arrow-up"></b-icon>
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

    <div
      class="px-5 book"
      :class="{
        'w-50': disposition == 'balance',
        'w-100': disposition == 'left',
        invisible: disposition == 'right',
      }"
    >
      <book-viewer></book-viewer>
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
  props: ["disposition"],
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
    execute() {
      this.exec();
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
.book.w-50 {
  width: 60% !important;
}
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
  display: none;
}

.balance {
  min-height: 40%;
  max-height: 50%;
}

.sandbox.w-50 {
  width: 40% !important;
}

.sandbox.w-50 > div {
  right: 60%;
}
.sandbox.w-100 > div {
  right: 20px;
}

.sandbox > div {
  position: fixed;
  left: 20px;
  overflow: scroll;
}
.sandbox > div::-webkit-scrollbar {
  width: 4px;
}
/* Handle */
.sandbox > div::-webkit-scrollbar-thumb {
  background: rgb(214, 168, 168);
}
/* Handle on hover */
.sandbox > div::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
