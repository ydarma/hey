<template>
  <b-button-group>
    <b-button :variant="color" class="left-pill" @click="clickLeft()">
      <b-icon size="lg" :icon="leftIcon"></b-icon>
    </b-button>
    <b-button :variant="color" @click="clickMiddle()">
      <b-icon size="lg" :icon="middleIcon"></b-icon>
    </b-button>
    <b-button :variant="color" class="right-pill" @click="clickRight()">
      <b-icon size="lg" :icon="rightIcon"></b-icon>
    </b-button>
  </b-button-group>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["direction"],
  computed: {
    leftIcon() {
      return this.direction == "h" ? "box-arrow-left" : "box-arrow-up";
    },
    middleIcon() {
      return this.direction == "h" ? "vr" : "hr";
    },
    rightIcon() {
      return this.direction == "h" ? "box-arrow-right" : "box-arrow-down";
    },
    color() {
      return this.direction == "h" ? "success" : "info";
    },
  },
  methods: {
    clickLeft() {
      this.$emit(this.direction == "h" ? "expand-left" : "expand-up");
    },
    clickMiddle() {
      this.$emit("even");
    },
    clickRight() {
      this.$emit(this.direction == "h" ? "expand-right" : "expand-down");
    },
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
</style>
