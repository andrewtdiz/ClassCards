<template>
  <transition name="size-up">
    <div
      v-if="modalDelay"
      class="bg-white z-20 rounded flex flex-col relative relative p-5"
      style="width: 650px; min-height: 300px"
    >
      <p class="uppercase text-xs">Content</p>
      <div class="relative w-full">
        <textarea
          type="text"
          class="text-3xl w-full border-gray-200 hover:border-gray-400 focus:border-blue-500 flex-1 border rounded px-2 py-1"
          ref="card"
        />
        <div class="text-3xl text-white bg-blue-500 mx-2 my-1 absolute top-0 left-0">Here I am</div>
      </div>

      <p class="uppercase text-xs mt-2">Tags</p>
      <input
        type="text"
        class="text-base border-gray-200 hover:border-gray-400 focus:border-blue-500 border rounded px-2 py-1"
      />
      <div class="flex w-full justify-end mt-4">
        <DefaultButton
          :type="'default-2'"
          @clicked="$store.commit('changeModal', '')"
          :label="'Cancel'"
          class="mr-4"
        />
        <DefaultButton :type="'brand'" :label="'Add Card'" />
      </div>
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
  watch: {
    modalDelay() {
      if (this.modalDelay) {
        setTimeout(() => {
          this.$refs["card"].focus();
        }, 100);
      }
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