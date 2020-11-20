<template>
  <transition name="size-up">
    <div
      v-if="modalDelay"
      class="bg-white z-20 rounded flex flex-col relative p-5"
      style="width: 650px; height: 300px"
    >
        <input type="text">
    </div>
  </transition>
</template>

<script>
import DefaultButton from "../Buttons/DefaultButton";

export default {
  props: ["modalDelay"],
  components: {
    DefaultButton,
  },
  computed: {
    currentDeck() {
      return this.$store.getters.getCurrentDeck;
    },
  },
  data() {
    return {
      flipCol: false,
    };
  },
  methods: {
    doThing(thing) {
      console.log(thing);
    },
  },
};
</script>

<style>
</style>