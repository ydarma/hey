<template>
  <div class="home">
    <HeyEditor />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeyEditor from "@/components/HeyEditor.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    HeyEditor,
  },
});
</script>
