<template>
  <div class="home m-3 d-flex flex-row h-100">
    <div class="p-2 w-50">
      <book-viewer></book-viewer>
    </div>
    <div class="p-2 w-50">
      <div class="d-flex flex-column h-100">
        <HeyEditor class="mb-2 border rounded p-1 flex-fill editor" />
        <div>
          <b-button variant="danger" class="mx-3" pill @click="exec()">
            <b-icon size="lg" icon="play"></b-icon>
          </b-button>
          <b-button variant="secondary" class="mr-3" pill @click="clear()">
            <b-icon size="lg" icon="x"></b-icon>
          </b-button>
        </div>
        <div class="p-2 flex-fill result">
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
  methods: {
    ...mapActions(["exec", "clear"]),
  },
  components: {
    HeyEditor,
    HeyOut,
    BookViewer,
  },
});
</script>

<style>
.editor,
.result {
  min-height: 30%;
  max-height: 45%;
}
</style>
