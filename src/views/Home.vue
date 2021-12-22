<template>
  <div
    class="d-flex flex-column h-100 sandbox"
    :class="{
      balance: disposition == 'balance',
      full: disposition == 'right',
      invisible: disposition == 'left',
    }"
  >
    <div
      class="mb-2 border rounded p-1 editor"
      :class="{
        minimize: minimizeEditor,
        balance: !minimizeEditor && !minimizeOut,
        maximize: minimizeOut,
      }"
    >
      <HeyEditor />
    </div>
    <div class="mb-1">
      <b-button variant="danger" class="mx-3" pill @click="execute()">
        <b-icon size="lg" icon="play"></b-icon>
      </b-button>
      <b-button variant="secondary" class="mx-3" pill @click="clear()">
        <b-icon size="lg" icon="x"></b-icon>
      </b-button>
      <b-button-group class="mx-3">
        <b-button variant="info" class="left-pill" @click="maximizeEditor()">
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
      class="p-2 result out"
      :class="{
        minimize: minimizeOut,
        balance: !minimizeEditor && !minimizeOut,
        maximize: minimizeEditor,
      }"
    >
      <HeyOut />
    </div>
  </div>

  <div
    class="px-5 book"
    :class="{
      balance: disposition == 'balance',
      full: disposition == 'left',
      invisible: disposition == 'right',
    }"
  >
    <book-viewer></book-viewer>
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
.book {
  position: absolute;
  right: 0;
}

.book.balance {
  left: 40%;
}

.book.full {
  left: 0;
}

.sandbox {
  position: fixed;
  left: 20px;
}

.sandbox.balance {
  right: 60%;
}

.sandbox.full {
  right: 20px;
}

.editor.maximize,
.out.maximize {
  min-height: 80%;
  max-height: 90%;
}

.editor.minimize,
.out.minimize {
  display: none;
}

.editor.balance,
.out.balance {
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
