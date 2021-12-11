<template>
  <div class="home m-3 d-flex flex-row h-100">
    <div class="p-2 w-50">
      <book-viewer></book-viewer>
    </div>
    <div class="p-2 w-50">
      <div class="d-flex flex-column h-100">
        <HeyEditor class="mb-2" />
        <div class="mx-3">
          <b-button variant="danger" pill @click="exec()">
            <b-icon size="lg" icon="play"></b-icon>
          </b-button>
        </div>
        <div class="p-2 flex-fill">
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
    ...mapActions(["exec"]),
  },
  components: {
    HeyEditor,
    HeyOut,
    BookViewer,
  },
});
</script>
