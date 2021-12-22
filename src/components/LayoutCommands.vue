<template>
  <b-button-group>
    <b-button :variant="color" class="left-pill" @click="clickLeft()">
      <b-icon size="lg" :icon="leftIcon"></b-icon>
    </b-button>
    <b-button
      :variant="color"
      @click="clickMiddle()"
      class="d-none d-md-inline"
      ref="middle"
    >
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
  emits: ["even", "expand-left", "expand-right", "expand-up", "expand-down"],
  data() {
    return {
      mode: "three",
    };
  },
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
  mounted() {
    const middle = (this.$refs.middle as { $el: HTMLElement }).$el;
    const changeMode = () => {
      this.mode = getComputedStyle(middle).display == "none" ? "two" : "three";
    };

    const resizeObserver = new ResizeObserver(() => {
      changeMode();
    });

    resizeObserver.observe(middle);
    changeMode();
  },
  watch: {
    mode(val) {
      if (val == "two") {
        this.$emit("expand-left");
        this.$emit("expand-down");
      }
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
