<template>
  <button
    type="button"
    @click="$emit('clicked')"
    :class="buttonStyle"
    class="w-full shadow transition-all duration-100 inline-flex justify-center rounded-md px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
  >
    {{ label }}
  </button>
</template>

<script>
export default {
  props: ["label", "type"],
  computed: {
    buttonStyle() {
      if (this.type == "brand") {
        return ["bg-brand-blue-500", "text-white", "hover:bg-brand-blue-600"];
      } else if (this.type == "default") {
        return ["text-gray-700", "bg-gray-100", "hover:bg-gray-200"];
      } else if (this.type == "default-2") {
        return ["text-gray-700", "bg-white", "hover:bg-gray-100"];
      }
    },
    currentDeck() {
      return this.$store.getters.getCurrentDeck;
    },
  },
};
</script>

<style>
</style>